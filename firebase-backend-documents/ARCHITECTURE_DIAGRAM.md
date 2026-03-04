# 🏗️ Architecture Diagram & Explanation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT NATIVE MOBILE APP                     │
│                    (Android & iOS devices)                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ src/services/api.ts
                         │ (All HTTP requests)
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼ (API_PROVIDER = 'firebase')    ▼ (API_PROVIDER = 'aws')
┌──────────────────────┐         ┌──────────────────────┐
│  FIREBASE BACKEND    │         │   AWS LAMBDA         │
│  (Google Cloud)      │         │   (Amazon)           │
│                      │         │                      │
│ ✨ Recommended       │         │ 📦 Fallback          │
│ ✅ Working          │         │ ⚠️  Broken (404s)    │
│ ✅ Modern           │         │                      │
│ ✅ Open source      │         │ Can deploy when      │
│ ✅ Maintained       │         │ Firebase is ready    │
│                      │         │                      │
└──────────┬───────────┘         └──────────┬───────────┘
           │                              │
    ┌──────┴───────┐                      │
    │              │                      │
    ▼              ▼                      ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  FIRESTORE   │  │   STORAGE    │  │  DYNAMODB    │
│  (NoSQL DB)  │  │  (Files)     │  │  (NoSQL DB)  │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Component Breakdown

### 1. Mobile App Layer
**What:** React Native app running on user's phone
**Files:**
- `src/services/api.ts` - Makes HTTP requests
- `src/services/apiConfig.ts` - Switches which backend to use
- `src/views/*` - Screens calling API endpoints

**How it works:**
```typescript
// In api.ts:
const response = await fetch(`${BASE_URL}/profile/${id}`);

// BASE_URL comes from apiConfig.ts which reads API_PROVIDER setting
```

### 2. API Configuration Layer (THE MAGIC)
**File:** `src/services/apiConfig.ts`

**Purpose:** Single source of truth for backend selection

```typescript
// 1 LINE TO CHANGE EVERYTHING:
export const API_PROVIDER = 'firebase';  // or 'aws'

// Every API call uses this config:
const config = {
  firebase: { baseURL: 'https://us-central1-YOUR_PROJECT.cloudfunctions.net/api' },
  aws: { baseURL: 'https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com' }
};

export const BASE_URL = config[API_PROVIDER].baseURL;
```

**Impact:** All 20+ API calls automatically use selected backend

### 3. Firebase Backend (Recommended)
**Location:** `firebase-backend/`

**Architecture:**
```
Firebase Backend
├── Cloud Functions (Express.js)
│   ├── /auth              - User authentication
│   ├── /profile           - Profile CRUD operations
│   ├── /checkIn           - Location check-ins
│   └── /location          - Nearby places search
│
├── Firestore Database
│   ├── users/
│   ├── profiles/
│   ├── checkIns/
│   └── locations/
│
└── Cloud Storage
    └── profile_pictures/
```

**Flow:**
```
Request: POST /profile
    ↓
Express middleware (CORS, logging)
    ↓
Firebase auth middleware (verify token)
    ↓
Profile handler (validate, sanitize)
    ↓
Firestore write operation
    ↓
Response: { success: true, profileId: '...' }
```

### 4. AWS Lambda Backend (Fallback)
**Status:** Currently broken (404 errors)

**Architecture:**
```
AWS Lambda Backend
├── API Gateway (REST endpoints)
│   ├── /auth              - Returns 404
│   ├── /profile           - Returns 404  
│   ├── /checkIn           - Returns 404
│   └── /location          - Returns 404
│
├── DynamoDB Database
│   ├── Users table
│   ├── Profiles table
│   └── CheckIns table
│
└── S3 Storage
    └── profile-pictures bucket (commented out)
```

**Problem:** Not deployed or misconfigured

**Solution:** Switch to Firebase (see QUICK_START.md)

## API Endpoint Structure

### All Endpoints (Works with Both Backends)

```
AUTHENTICATION
POST   /auth                   - Verify phone & get token
GET    /auth/verify            - Validate token is valid

PROFILES  
POST   /profile                - Create new profile
GET    /profile/{id}           - Get profile by ID
GET    /profile/mobile/{phone} - Find profile by phone
GET    /profile/place/{place}  - Find people at location
PUT    /profile/{id}           - Update profile
DELETE /profile/{id}           - Delete profile
GET    /profile/friends/{id}   - Get friend requests

CHECK-INS
POST   /checkin                - Check user in at location
GET    /checkin/{locationId}   - Find people at location
DELETE /checkin/{profileId}    - Check user out

LOCATION
POST   /location               - Search nearby places
```

## Data Flow Example: User Profile Creation

```
1. User fills form (interests, bio, photo)
   └─> State stored in Redux

2. User taps "Save Profile"
   └─> Redux Saga intercepts action

3. Saga calls: api.insertProfile(profileData)
   └─> Looks up BASE_URL from apiConfig.ts

4. HTTP Request:
   POST {BASE_URL}/profile
   Headers: { Authorization: 'Bearer {token}' }
   Body: { name, interests, bio, photo_url, ... }

5. Backend Handler:
   a) Middleware verifies Firebase token ✓
   b) Validates data (required fields, types) ✓
   c) Sanitizes input ✓
   d) Writes to Firestore ✓
   e) Returns success response

6. Response received:
   {
     "success": true,
     "profileId": "abc123",
     "profile": { ... }
   }

7. Redux Saga processes response
   └─> Stores profile in state
   └─> Navigates to next screen

8. ✅ Success! App in sync with backend
```

## Security Architecture

### Authentication Flow
```
User logs in with phone number
   ↓
Firebase Authentication generates unique token
   ↓
Token sent with every API request in Authorization header
   ↓
Backend middleware verifies token signature
   ↓
Request processed with user context
   ↓
Response includes user's data
```

### Token Verification Middleware
```typescript
// middleware/auth.ts
export const verifyToken = async (req, res, next) => {
  1. Extract token from Authorization header
  2. Verify signature using Firebase public keys
  3. Extract user ID from token
  4. Attach user to request (req.user = { uid, ... })
  5. Call next() to proceed
  
  If token invalid → Send 401 Unauthorized
}
```

## Database Schema

### Firestore Collections Structure

**users/{uid}**
```
{
  uid: "firebase_user_id",
  phoneNumber: "+1234567890",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**profiles/{profileId}**
```
{
  userId: "uid",
  name: "John Doe",
  bio: "Love hiking",
  interests: ["hiking", "music", "photography"],
  profilePicUrl: "gs://bucket/pic.jpg",
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    geohash: "dr5regw"
  },
  createdAt: timestamp
}
```

**checkIns/{checkInId}**
```
{
  userId: "uid",
  profileId: "profileId",
  location: "Central Park",
  latitude: 40.785,
  longitude: -73.968,
  checkedInAt: timestamp,
  checkedOutAt: timestamp
}
```

## Deployment Architecture

### Firebase Cloud Functions Environment
```
Node.js 18 Runtime
(Google Cloud infrastructure)
   ├── Environment variables (.env file)
   │   ├── GOOGLE_PLACES_API_KEY
   │   ├── FIREBASE_PROJECT_ID
   │   └── ... more
   │
   ├── Express.js app
   │   ├── Middleware (CORS, auth)
   │   ├── Routes (api/auth, api/profile, etc.)
   │   └── Error handling
   │
   └── Firestore SDK
       └── Reads/writes data
```

### How Cloud Functions Work
```
Deploy → Google Cloud assigns URL
            ↓
Request → Google routes to function
             ↓
Function runs in sandbox
             ↓
Accesses Firestore (in same project)
             ↓
Returns response
             ↓
Google caches appropriate HTTP headers
```

## Switching Backends (How It Works)

### Before Deployment
```
apiConfig.ts: API_PROVIDER = 'firebase'
      ↓
But Firebase project doesn't exist yet
      ↓
Request fails → Error shows in app
      ↓
Switch back: API_PROVIDER = 'aws'
      ↓
App works (but with broken AWS)
```

### After Deployment
```
apiConfig.ts: API_PROVIDER = 'firebase'
      ↓
Request goes to Firebase
      ↓
✅ Works perfectly
      ↓
All users get new reliable backend
```

### Emergency Fallback
```
Firebase having issues?
      → Change 1 line in apiConfig.ts
      → All users instantly switch to AWS
      → Buys time to debug Firebase
```

## Performance Characteristics

### Firebase
- **Request time:** 150-300ms (Google infrastructure)
- **Scaling:** Automatic (handles traffic spikes)
- **Database:** Optimized for mobile realtime queries
- **Cost:** $0-25/month for typical app

### AWS (When working)
- **Request time:** 200-400ms (cross-region latency)
- **Scaling:** Manual or configured separately
- **Database:** General-purpose NoSQL
- **Cost:** $0-50/month for typical app

## Monitoring & Debugging

### View Firebase Logs
```bash
firebase functions:log
# Shows real-time function execution logs
```

### View Mobile App Requests
```
Use Redux DevTools browser extension
View all API calls in network tab
```

### Check Database
```
Firebase Console → Firestore
View all documents, collections, backups
```

## Disaster Recovery

### If Firebase Goes Down
```
1. Edit src/services/apiConfig.ts
2. Change: API_PROVIDER = 'aws'
3. Deploy to app stores
4. Users updated → Start using AWS
5. Firebase recovers → Switch back
```

### If AWS Goes Down
```
1. Firebase already running
2. No action needed (already on Firebase)
3. Zero downtime!
```

### Backup Strategy
```
Firebase automatic:
- Automatic daily backups
- Point-in-time recovery
- Multi-region redundancy

You should also:
- Export data weekly
- Version control all code
- Test restoration process annually
```

---

## 📚 Next Steps

1. **Deploy:** See [QUICK_START.md](QUICK_START.md)
2. **Switch:** See [BACKEND_SWITCHING_GUIDE.md](BACKEND_SWITCHING_GUIDE.md)
3. **Understand:** See [FIREBASE_BACKEND_SUMMARY.md](FIREBASE_BACKEND_SUMMARY.md)

---

**Questions?** Check other documentation files in this folder!
