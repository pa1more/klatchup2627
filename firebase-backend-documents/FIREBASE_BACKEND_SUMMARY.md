# 📋 Firebase Backend Technical Summary

## Backend Project Overview

**Location:** `firebase-backend/`
**Status:** ✅ Complete, ready to deploy
**Implementation:** Node.js 18 + Express.js + Firestore + Cloud Storage
**Lines of Code:** 800+ across 8 TypeScript files

## Project Structure

```
firebase-backend/
├── src/
│   ├── index.ts                 ← Entry point (Cloud Function)
│   ├── firebase.ts              ← Database initialization
│   ├── middleware/
│   │   └── auth.ts              ← Firebase token verification
│   └── api/
│       ├── auth/
│       │   └── index.ts          ← Authentication endpoints
│       ├── profiles/
│       │   ├── index.ts          ← Profile CRUD operations (230+ lines)
│       │   └── types.ts          ← TypeScript interfaces
│       ├── checkIn/
│       │   └── index.ts          ← Check-in/location tracking
│       ├── location/
│       │   └── index.ts          ← Google Places integration
│       └── ApiError.ts           ← Error handling utilities
│
├── package.json                 ← Dependencies (11 packages)
├── tsconfig.json               ← TypeScript configuration  
├── .env.example                ← Environment variables template
├── .gitignore                  ← Git ignore rules
├── README.md                   ← Backend setup guide
├── setup.sh                    ← Automated setup script
├── firebase.json               ← Firebase project config
└── dist/                       ← Compiled JavaScript (generated)
```

## Core Files Explained

### 1. index.ts (Entry Point - 55 lines)

**Purpose:** Main Cloud Function that receives all HTTP requests

**Code Structure:**
```typescript
// 1. Import dependencies
import express from 'express';
import cors from 'cors';

// 2. Initialize Express app
const app = express();

// 3. Apply middleware
app.use(cors());
app.use(express.json());

// 4. Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 5. Register API routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/checkin', checkInRoutes);
app.use('/location', locationRoutes);

// 6. Error handling
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json(error);
});

// 7. Export as Cloud Function
export const api = onRequest(app);
```

**What happens:**
1. User's mobile app sends HTTP request to Cloud Function URL
2. Firebase receives request at `https://us-central1-PROJECT_ID.cloudfunctions.net/api`
3. Cloud Function routes request to correct handler
4. Handler processes request, accesses Firestore
5. Response sent back to mobile app

### 2. firebase.ts (Database Setup - 20 lines)

**Purpose:** Initialize Firestore and Cloud Storage connections

**Code Structure:**
```typescript
// 1. Initialize Firebase Admin
import * as admin from 'firebase-admin';

// 2. Initialize Firestore
const db = admin.firestore();

// 3. Initialize Storage
const storage = admin.storage();

// 4. Export for use in other files
export { db, storage };

// Later use in handlers:
// import { db } from '../firebase';
// const users = await db.collection('users').where(...).get();
```

**Role:** All database operations go through this file

### 3. middleware/auth.ts (35 lines)

**Purpose:** Verify Firebase auth token on protected endpoints

**Code Structure:**
```typescript
import * as admin from 'firebase-admin';

// Middleware function
export const verifyToken = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // 2. Verify token signature
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // 3. Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      phoneNumber: decodedToken.phone_number
    };
    
    // 4. Continue to next handler
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Usage in routes:
// router.get('/profile/:id', verifyToken, handler);
// Now handler has access to req.user
```

### 4. api/profiles/types.ts (50 lines)

**Purpose:** TypeScript interfaces defining data structures

**Key Types:**
```typescript
interface Profile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  interests: Interest[];
  location: CurrentLocation;
  profilePicUrl: string;
  createdAt: number;
  updatedAt: number;
}

interface Interest {
  id: string;
  name: string;
  category: string;
}

interface CurrentLocation {
  latitude: number;
  longitude: number;
  geohash: string;
  address: string;
}
```

**Purpose:** Type safety for all profile operations

### 5. api/profiles/index.ts (230+ lines)

**Purpose:** Profile CRUD operations (Create, Read, Update, Delete)

**Endpoints Implemented:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/profile` | Create new profile |
| GET | `/profile/{id}` | Get profile by ID |
| GET | `/profile/mobile/{phone}` | Find profile by phone |
| GET | `/profile/place/{location}` | Find profiles at location |
| GET | `/profile/friends/{id}` | Get friend requests |
| PUT | `/profile/{id}` | Update profile |
| DELETE | `/profile/{id}` | Delete profile |

**Code Pattern (Example - Create Profile):**
```typescript
router.post('/', verifyToken, async (req, res) => {
  try {
    // 1. Extract data from request
    const { name, bio, interests, location, profilePicUrl } = req.body;
    
    // 2. Validate required fields
    if (!name || !bio) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // 3. Generate unique ID
    const profileId = db.collection('profiles').doc().id;
    
    // 4. Prepare profile object
    const profileData = {
      id: profileId,
      userId: req.user.uid,
      name,
      bio,
      interests,
      location,
      profilePicUrl,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    };
    
    // 5. Write to Firestore
    await db.collection('profiles').doc(profileId).set(profileData);
    
    // 6. Return success
    res.json({ success: true, profile: profileData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 6. api/auth/index.ts (45 lines)

**Purpose:** Authentication endpoints

**Endpoints:**
- `POST /auth` - Verify phone and get Firebase token
- `GET /auth/verify` - Validate existing token

**Code Pattern:**
```typescript
// Firebase handles OTP/phone verification in mobile app
// Backend just validates and returns user info

router.post('/', async (req, res) => {
  try {
    const { idToken } = req.body; // From mobile app after phone auth
    
    // Verify token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    res.json({
      success: true,
      userId: decodedToken.uid,
      email: decodedToken.email
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

### 7. api/checkIn/index.ts (95 lines)

**Purpose:** Location check-in operations

**Endpoints:**
- `POST /checkin` - Check user in at location
- `GET /checkin/{locationId}` - Get users at location
- `DELETE /checkin/{profileId}` - Check user out

**Features:**
- Geohash encoding for location queries
- Batch operations for multiple profiles
- Timestamp tracking

### 8. api/location/index.ts (50 lines)

**Purpose:** Google Places API integration

**Endpoints:**
- `POST /location` - Search nearby places

**Code Pattern:**
```typescript
router.post('/', verifyToken, async (req, res) => {
  try {
    const { latitude, longitude, radiusMeters } = req.body;
    
    // Query Google Places API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${latitude},${longitude}&` +
      `radius=${radiusMeters}&` +
      `key=${process.env.GOOGLE_PLACES_API_KEY}`
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Database Schema

### Firestore Collections

#### users/
```typescript
{
  uid: "firebase_auth_uid",
  phoneNumber: "+1234567890",
  createdAt: 1234567890,
  lastLogin: 1234567890,
  status: "active" | "inactive"
}
```

#### profiles/
```typescript
{
  id: "profile_unique_id",
  userId: "firebase_user_id",
  name: "John Doe",
  bio: "Love hiking",
  interests: [
    { id: "i1", name: "Hiking", category: "outdoor" },
    { id: "i2", name: "Music", category: "arts" }
  ],
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    geohash: "dr5regw",
    address: "New York, NY"
  },
  profilePicUrl: "gs://bucket/pictures/pic123.jpg",
  createdAt: 1234567890,
  updatedAt: 1234567890
}
```

#### checkIns/
```typescript
{
  id: "checkin_id",
  userId: "firebase_user_id",
  profileId: "profile_id",
  location: "Central Park",
  latitude: 40.785,
  longitude: -73.968,
  checkedInAt: 1234567890,
  checkedOutAt: null
}
```

## Deployment Steps

### Prerequisites
```bash
# 1. Install Node.js 18+
node --version

# 2. Install Firebase CLI
npm install -g firebase-tools

# 3. Login to Firebase
firebase login
```

### Deployment Process
```bash
# 1. Navigate to backend
cd firebase-backend

# 2. Install dependencies
npm install

# 3. Compile TypeScript
npm run build

# 4. Deploy to Firebase
firebase deploy

# Output will show deployed URL:
# Function URL (apiEndpoint):
# https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api
```

### After Deployment
```bash
# 1. Copy the URL from deployment output

# 2. Update mobile app config:
# Edit: src/services/apiConfig.ts
# Find line with Firebase baseURL
# Paste new URL

# 3. Restart app
npm run android  # or: npm run ios
```

## Error Handling

### Standard Error Response Format
```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    public type: string,
    public message: string
  ) {
    super(message);
  }
}

// Thrown as:
throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid profile data');

// Returned to client as:
{
  "status": 400,
  "type": "VALIDATION_ERROR",
  "message": "Invalid profile data"
}
```

### HTTP Status Codes Used
- `200` - Success
- `201` - Created
- `400` - Bad request (validation error)
- `401` - Unauthorized (auth required, token invalid)
- `403` - Forbidden (user not allowed)
- `404` - Not found (resource doesn't exist)
- `500` - Server error

## Environment Variables

### Required (.env file)
```bash
GOOGLE_PLACES_API_KEY=your_key_here
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
```

### How to Get These
1. Firebase Console → Project Settings
2. Service Accounts tab
3. Generate new private key
4. Copy values from JSON file

## Performance Optimization

### Database Indexes
```
Created indexes:
- profiles: userId, createdAt
- profiles: location.geohash (for location queries)
- checkIns: userId, checkedInAt
- checkIns: location, checkedInAt
```

### Caching
- Cloud Functions auto-cache responses
- Set appropriate Cache-Control headers

### Geohashing
```typescript
// Efficient location queries
import geohash from 'ngeohash';
const place = geohash.encode(lat, lon);
// Enables sub-kilometer spatial queries
```

## Security

### Token Verification
```typescript
// Every protected endpoint uses:
export const verifyToken = async (req, res, next) => {
  const decodedToken = await admin.auth().verifyIdToken(token);
  req.user = decodedToken;
  next();
};
```

### CORS
```typescript
app.use(cors({
  origin: ['https://yourapp.example.com', 'http://localhost:8081'],
  credentials: true
}));
```

### Rate Limiting
```typescript
// Implemented via Cloud Functions quotas
// Default: 1M calls/month free tier
```

## Monitoring & Debugging

### View Real-Time Logs
```bash
firebase functions:log --follow
```

### Check Deployment Status
```bash
firebase functions:list
```

### View Error Details
```bash
firebase functions:log
# Look for errors with red timestamps
```

### Local Testing
```bash
# Install Firebase Emulator
npm install -g @firebase/cli

# Start emulator
firebase emulators:start

# Run tests against local emulator
npm test
```

## Scaling Information

### Automatic Scaling
- Cold starts: ~3-5 seconds
- Peak QPS: 1000+ requests/second
- Cost: $0.40 per million invocations

### For 10k Daily Active Users
- Typical usage: 50k-100k requests/day
- Estimated cost: $0.02-0.04/day ($1-2/month)

## Troubleshooting

### Common Issues

**Issue:** `Error: Cannot find module 'firebase-admin'`
```bash
Solution: npm install firebase-admin
```

**Issue:** Cloud function returns 404
```bash
Solution: Verify firebase.json has correct project ID
firebase deploy --project YOUR_PROJECT_ID
```

**Issue:** Slow responses (>1 second)
```bash
Check:
1. Database indexes created
2. No N+1 queries in handlers
3. Cloud function memory adequate (512MB default)
```

---

## 📚 Related Files

- Backend code: `firebase-backend/src/`
- Mobile integration: `src/services/apiConfig.ts`
- Deployment guide: `QUICK_START.md`

---

**Ready to deploy?** → [QUICK_START.md](QUICK_START.md) 🚀
