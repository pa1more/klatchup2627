import { Router, Request, Response } from 'express';
import { db } from '../../firebase';
import { verifyAuth } from '../../middleware/auth';
import * as admin from 'firebase-admin';

const router = Router();

// POST /checkin - User checks into a location
router.post('/', verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const { placeName, latitude, longitude } = req.body;

    if (!userId || !placeName || !latitude || !longitude) {
      return res.status(400).json({
        message: 'placeName, latitude, and longitude are required',
        type: 'VALIDATION_ERROR',
      });
    }

    const checkInData = {
      userId,
      placeName,
      latitude: parseFloat(latitude as string),
      longitude: parseFloat(longitude as string),
      checkedInAt: admin.firestore.Timestamp.now(),
      isActive: true,
    };

    // Update user profile with current check-in
    await db.collection('profiles').doc(userId).update({
      'currentLocation.placeName': placeName,
      'currentLocation.lat': String(latitude),
      'currentLocation.long': String(longitude),
      isActive: true,
      lastCheckInAt: admin.firestore.Timestamp.now(),
    });

    // Create/update check-in record
    await db.collection('checkins').doc(userId).set(checkInData, { merge: true });

    console.log(`✅ User ${userId} checked in at ${placeName}`);

    res.status(200).json({
      message: 'Checked in successfully',
      checkIn: checkInData,
    });
  } catch (error: any) {
    console.error('Error checking in:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// POST /checkin/checkout - User checks out from a location
router.post('/checkout', verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({
        message: 'User ID not found',
        type: 'UNAUTHORIZED',
      });
    }

    // Update user profile to mark as inactive
    await db.collection('profiles').doc(userId).update({
      isActive: false,
      lastCheckOutAt: admin.firestore.Timestamp.now(),
    });

    // Update check-in record
    await db.collection('checkins').doc(userId).update({
      isActive: false,
      checkedOutAt: admin.firestore.Timestamp.now(),
    });

    console.log(`✅ User ${userId} checked out`);

    res.status(200).json({
      message: 'Checked out successfully',
    });
  } catch (error: any) {
    console.error('Error checking out:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// POST /checkin/update-location - Update user location for auto-checkout detection
router.post('/update-location', verifyAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const { latitude, longitude } = req.body;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({
        message: 'latitude and longitude are required',
        type: 'VALIDATION_ERROR',
      });
    }

    const userLat = parseFloat(latitude as string);
    const userLon = parseFloat(longitude as string);

    // Get user's current check-in
    const checkInDoc = await db.collection('checkins').doc(userId).get();

    if (!checkInDoc.exists || !checkInDoc.data()?.isActive) {
      return res.status(200).json({
        message: 'User is not currently checked in',
        checkedIn: false,
      });
    }

    const checkInData = checkInDoc.data();
    const checkInLat = checkInData?.latitude || 0;
    const checkInLon = checkInData?.longitude || 0;

    // Calculate distance from check-in location
    const distance = calculateDistance(checkInLat, checkInLon, userLat, userLon);
    const distanceThresholdKm = 1; // 1km auto-checkout

    console.log(`📍 User ${userId} at distance ${distance.toFixed(2)}km from ${checkInData?.placeName}`);

    if (distance > distanceThresholdKm) {
      // Auto-checkout user
      console.log(`⚠️ Auto-checkout: User ${userId} moved ${distance.toFixed(2)}km away from ${checkInData?.placeName}`);
      
      await db.collection('profiles').doc(userId).update({
        isActive: false,
        lastCheckOutAt: admin.firestore.Timestamp.now(),
      });

      await db.collection('checkins').doc(userId).update({
        isActive: false,
        checkedOutAt: admin.firestore.Timestamp.now(),
        autoCheckedOut: true,
      });

      return res.status(200).json({
        message: 'Auto-checked out: You moved too far from the location',
        autoCheckedOut: true,
        distance: distance.toFixed(2),
        checkedIn: false,
      });
    }

    // Update current location in check-in
    await db.collection('checkins').doc(userId).update({
      currentLatitude: userLat,
      currentLongitude: userLon,
      lastLocationUpdateAt: admin.firestore.Timestamp.now(),
    });

    res.status(200).json({
      message: 'Location updated',
      distance: distance.toFixed(2),
      withinRadius: true,
      checkedIn: true,
    });
  } catch (error: any) {
    console.error('Error updating location:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// GET /checkin/online-at-place/:placeName - Get all online users at a specific place
router.get('/online-at-place/:placeName', verifyAuth, async (req: Request, res: Response) => {
  try {
    const { placeName } = req.params;
    const userId = req.user?.uid;

    const snapshot = await db
      .collection('checkins')
      .where('placeName', '==', placeName)
      .where('isActive', '==', true)
      .get();

    const onlineUsers: any[] = [];

    for (const doc of snapshot.docs) {
      const checkin = doc.data();
      
      // Skip current user
      if (doc.id === userId) continue;

      const userDoc = await db.collection('profiles').doc(doc.id).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        onlineUsers.push({
          profileId: doc.id,
          name: userData?.name,
          profilePicture: userData?.profilePicture,
          birthDate: userData?.birthDate,
          bio: userData?.bio,
          interests: userData?.interests,
          checkedInAt: checkin.checkedInAt,
          isAvailable: true,
        });
      }
    }

    res.status(200).json({
      placeName,
      onlineUsers,
      count: onlineUsers.length,
    });
  } catch (error: any) {
    console.error('Error getting online users:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export default router;
