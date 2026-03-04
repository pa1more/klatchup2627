import { Router, Request, Response } from 'express';
import { db, storage } from '../../firebase';
import { verifyAuth } from '../../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { NewProfile } from './types';
import * as admin from 'firebase-admin';

const router = Router();

// GET /profile/all - List all profiles (debug endpoint)
router.get('/all', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('profiles').get();
    
    const profiles = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        profileId: doc.id,
        name: data.name,
        mobile: data.mobile,
        isActive: data.isActive,
        isDeleted: data.isDeleted,
        currentLocation: data.currentLocation,
      };
    });

    res.status(200).json({
      count: profiles.length,
      profiles
    });
  } catch (error: any) {
    console.error('Error listing all profiles:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// GET /profile/mobile/{mobile} - Fetch profile by mobile number (MUST come before /:profileId)
router.get('/mobile/:mobile', verifyAuth, async (req: Request, res: Response) => {
  try {
    const { mobile } = req.params;
    const snapshot = await db
      .collection('profiles')
      .where('mobile', '==', mobile)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        message: 'Not Found',
        type: 'PROFILE_NOT_FOUND',
      });
    }

    const profileDoc = snapshot.docs[0];
    res.status(200).json({
      profile: { profileId: profileDoc.id, ...profileDoc.data() },
    });
  } catch (error: any) {
    console.error('Error fetching profile by mobile:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// GET /profile/{profileId} - Fetch profile by ID (MUST come after /mobile/:mobile)
router.get('/:profileId', verifyAuth, async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const profileDoc = await db.collection('profiles').doc(profileId).get();

    if (!profileDoc.exists) {
      return res.status(404).json({
        message: 'Profile not found',
        type: 'PROFILE_NOT_FOUND',
      });
    }

    res.status(200).json({
      profile: { profileId: profileDoc.id, ...profileDoc.data() },
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// POST /profile - Create new profile
router.post('/', verifyAuth, async (req: Request, res: Response) => {
  try {
    console.log('POST /profile - Request received');
    console.log('Auth UID:', req.user?.uid);
    const { profile } = req.body;

    if (!profile) {
      console.log('No profile data in request body');
      return res.status(400).json({
        message: 'Profile data is required',
        type: 'VALIDATION_ERROR',
      });
    }

    console.log('Profile data received:', { name: profile.name, mobile: profile.mobile });
    
    // Use the Firebase UID as the profileId (matches Firestore rules)
    const profileId = req.user?.uid;
    if (!profileId) {
      return res.status(401).json({
        message: 'User UID not found in auth token',
        type: 'UNAUTHORIZED',
      });
    }
    console.log('Using auth UID as profileId:', profileId);
    
    // Provide defaults for missing fields
    const profileWithDefaults: any = {
      name: profile.name || '',
      mobile: profile.mobile || '',
      birthDate: profile.birthDate || '',
      gender: profile.gender || '',
      interests: profile.interests || [],
      city: profile.city || '',
      bio: profile.bio || '',
      profilePicture: profile.profilePicture || '',
      showPictures: profile.showPictures || [],
      work: profile.work || '',
      education: profile.education || '',
      lookingFor: profile.lookingFor || '',
      currentLocation: profile.currentLocation || { placeName: '', lat: '0', long: '0' },
      friendRequest: profile.friendRequest || { user_ids: [] },
      friends: profile.friends || { user_ids: [] },
      isActive: profile.isActive !== undefined ? profile.isActive : true,
      isDeleted: profile.isDeleted !== undefined ? profile.isDeleted : false,
      updatedAt: new Date(),
    };

    const newProfile: any = {
      ...profileWithDefaults,
      profileId,
      createdAt: new Date(),
    };

    console.log('About to write to Firestore. ProfileId:', profileId);
    console.log('Firestore collection reference:', typeof db);
    
    try {
      await db.collection('profiles').doc(profileId).set({
        ...newProfile,
        createdAt: admin.firestore.Timestamp.now(),
        mobile: profileWithDefaults.mobile,
        // Add geohash for location-based queries (for future optimization)
        geohash: encodeGeohash(
          parseFloat(profileWithDefaults.currentLocation?.lat || '0'),
          parseFloat(profileWithDefaults.currentLocation?.long || '0')
        ),
      });
      console.log('Profile written to Firestore successfully');
    } catch (dbError: any) {
      console.error('Firestore write error - Full error:', dbError);
      console.error('Error code:', dbError.code);
      console.error('Error message:', dbError.message);
      throw dbError;
    }

    res.status(201).json({ profile: newProfile });
  } catch (error: any) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// PUT /profile/{profileId} - Update profile
router.put('/:profileId', verifyAuth, async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({
        message: 'Profile data is required',
        type: 'VALIDATION_ERROR',
      });
    }

    const profileRef = db.collection('profiles').doc(profileId);
    const profileSnapshot = await profileRef.get();

    if (!profileSnapshot.exists) {
      return res.status(404).json({
        message: 'Profile not found',
        type: 'PROFILE_NOT_FOUND',
      });
    }

    const existingData = profileSnapshot.data();
    const updatedProfile = {
      ...profile,
      profileId,
      createdAt: existingData?.createdAt,
      geohash: encodeGeohash(
        parseFloat(profile.currentLocation?.lat || '0'),
        parseFloat(profile.currentLocation?.long || '0')
      ),
    };

    await profileRef.set(updatedProfile, { merge: true });

    res.status(200).json({ profile: updatedProfile });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// DELETE /profile/{profileId} - Delete profile
router.delete('/:profileId', verifyAuth, async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const profileRef = db.collection('profiles').doc(profileId);

    const profileSnapshot = await profileRef.get();
    if (!profileSnapshot.exists) {
      return res.status(404).json({
        message: 'Profile not found',
        type: 'PROFILE_NOT_FOUND',
      });
    }

    await profileRef.delete();
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting profile:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// GET /profile/place/{placeName} - Get profiles by location
router.get('/place/:placeName', verifyAuth, async (req: Request, res: Response) => {
  try {
    const { placeName } = req.params;
    const snapshot = await db
      .collection('profiles')
      .where('currentLocation.placeName', '==', placeName)
      .get();

    const profiles = snapshot.docs.map(doc => ({
      profileId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ profiles });
  } catch (error: any) {
    console.error('Error fetching profiles by place:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// GET /profile/friends/{profileId} - Get friend requests
router.get('/friends/:profileId', verifyAuth, async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const profileDoc = await db.collection('profiles').doc(profileId).get();

    if (!profileDoc.exists) {
      return res.status(404).json({
        message: 'Profile not found',
        type: 'PROFILE_NOT_FOUND',
      });
    }

    const profileData = profileDoc.data();
    const friendIds = profileData?.friendRequest?.user_ids || [];

    if (friendIds.length === 0) {
      return res.status(200).json({ profiles: [] });
    }

    const snapshot = await db
      .collection('profiles')
      .where(admin.firestore.FieldPath.documentId(), 'in', friendIds)
      .get();

    const profiles = snapshot.docs.map(doc => ({
      profileId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ profiles });
  } catch (error: any) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// POST /profile/nearby - Find nearby users within radius
router.post('/nearby', verifyAuth, async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radiusMeters = 5000 } = req.body;
    const currentUserId = req.user?.uid;

    console.log(`🔍 Finding nearby users for user ${currentUserId} at ${latitude}, ${longitude}`);

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'latitude and longitude are required',
        type: 'VALIDATION_ERROR',
      });
    }

    // Fetch all active profiles (excluding the current user)
    const snapshot = await db
      .collection('profiles')
      .where('isActive', '==', true)
      .where('isDeleted', '==', false)
      .get();

    console.log(`📊 Total profiles in database: ${snapshot.docs.length}`);

    const userLat = parseFloat(latitude as string);
    const userLon = parseFloat(longitude as string);
    const radiusKm = radiusMeters / 1000;

    const nearbyProfiles = snapshot.docs
      .filter(doc => doc.id !== currentUserId) // Exclude current user
      .map(doc => {
        const data = doc.data();
        const profileLat = parseFloat(data.currentLocation?.lat || '0');
        const profileLon = parseFloat(data.currentLocation?.long || '0');
        
        // Calculate distance using Haversine formula
        const distance = calculateDistance(userLat, userLon, profileLat, profileLon);
        
        console.log(`  📍 ${data.name}: lat=${profileLat}, lon=${profileLon}, distance=${distance.toFixed(2)}km`);
        
        return {
          profileId: doc.id,
          ...data,
          distance: distance, // Distance in km
        };
      })
      .filter(profile => profile.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    console.log(`✅ Found ${nearbyProfiles.length} users within ${radiusKm}km`);

    res.status(200).json({ 
      profiles: nearbyProfiles,
      count: nearbyProfiles.length,
      radius: radiusMeters,
    });
  } catch (error: any) {
    console.error('❌ Error finding nearby users:', error);
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      type: 'ERROR',
    });
  }
});

// Calculate distance between two coordinates using Haversine formula
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

// Simple geohash encoding (for location-based queries)
function encodeGeohash(lat: number, lon: number): string {
  // Simplified geohash - in production use a proper library
  return `${Math.round(lat * 100)},${Math.round(lon * 100)}`;
}

// POST /profile/seed/dummy - Create 10 dummy users (for testing)
router.post('/seed/dummy', async (req: Request, res: Response) => {
  try {
    console.log('🚀 Starting to seed 10 dummy users...');
    
    const mcDonalds = {
      placeName: 'McDonald\'s - Hijewadi Happiness Street',
      lat: '18.5912',
      long: '73.8235'
    };

    const dummyUsers = [
      { name: 'Priya Singh', mobile: '+918001001001', birthDate: '1995-05-15', gender: 'Female', bio: 'Love coffee and good conversations!', work: 'Product Manager', education: 'B.Tech CS' },
      { name: 'Raj Patel', mobile: '+918001001002', birthDate: '1992-08-22', gender: 'Male', bio: 'Foodie and adventure seeker 🌍', work: 'Senior Developer', education: 'B.Tech IT' },
      { name: 'Anjali Sharma', mobile: '+918001001003', birthDate: '1998-03-10', gender: 'Female', bio: 'Artist, photographer, coffee lover ☕', work: 'Graphic Designer', education: 'Diploma Design' },
      { name: 'Vikram Desai', mobile: '+918001001004', birthDate: '1990-12-05', gender: 'Male', bio: 'Entrepreneur, love networking!', work: 'Business Analyst', education: 'MBA' },
      { name: 'Neha Gupta', mobile: '+918001001005', birthDate: '1996-07-18', gender: 'Female', bio: 'Yoga enthusiast and nature lover 🌿', work: 'HR Executive', education: 'B.A Psychology' },
      { name: 'Arjun Kumar', mobile: '+918001001006', birthDate: '1993-11-28', gender: 'Male', bio: 'Movie buff and trivia master 🎬', work: 'Marketing Manager', education: 'B.Com' },
      { name: 'Pooja Reddy', mobile: '+918001001007', birthDate: '1997-02-14', gender: 'Female', bio: 'Food blogger and restaurant explorer 🍽️', work: 'Content Writer', education: 'B.A English' },
      { name: 'Rohit Singh', mobile: '+918001001008', birthDate: '1991-09-03', gender: 'Male', bio: 'Guitarist and music producer 🎸', work: 'Audio Engineer', education: 'Bachelor Music' },
      { name: 'Divya Nair', mobile: '+918001001009', birthDate: '1994-06-20', gender: 'Female', bio: 'Entrepreneur, fitness fanatic 💪', work: 'Founder - Fitness App', education: 'B.Tech Biotech' },
      { name: 'Aman Verma', mobile: '+918001001010', birthDate: '1989-04-11', gender: 'Male', bio: 'Startup advisor, mentor, investor 🚀', work: 'Business Consultant', education: 'MBA Finance' }
    ];

    let created = 0;
    for (let i = 0; i < dummyUsers.length; i++) {
      const user = dummyUsers[i];
      const userId = `dummy-user-${i + 1}`;
      
      const profileData = {
        name: user.name,
        mobile: user.mobile,
        birthDate: user.birthDate,
        gender: user.gender,
        city: 'Pune',
        bio: user.bio,
        work: user.work,
        education: user.education,
        lookingFor: 'Friends',
        interests: [],
        profilePicture: `https://i.pravatar.cc/150?img=${i}`,
        showPictures: [],
        currentLocation: mcDonalds,
        friendRequest: { user_ids: [] },
        friends: { user_ids: [] },
        isActive: true,
        isDeleted: false,
        geohash: encodeGeohash(18.5912, 73.8235),
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
      };

      await db.collection('profiles').doc(userId).set(profileData);
      created++;
      console.log(`✅ Created: ${user.name} (${userId})`);
    }

    res.status(201).json({
      message: 'Dummy users created successfully',
      count: created,
      location: mcDonalds.placeName,
      userIds: Array.from({ length: 10 }, (_, i) => `dummy-user-${i + 1}`)
    });
  } catch (error: any) {
    console.error('❌ Error seeding users:', error);
    res.status(500).json({
      message: error.message || 'Error seeding users',
      type: 'ERROR',
    });
  }
});

export default router;
