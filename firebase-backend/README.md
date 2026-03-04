# Klatchup Firebase Backend

Complete Firebase Functions backend for Klatchup mobile app.

## Features

✅ Profile Management (CRUD)  
✅ Firebase Authentication Integration  
✅ Location-based User Matching  
✅ Check-in System  
✅ Real-time Updates (via Firestore)  
✅ Image Upload to Firebase Storage  
✅ Google Places API Integration  

## Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase Project created

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
```bash
firebase login
firebase init
```

Select:
- ✅ Functions
- ✅ Firestore
- ✅ Storage

### 3. Environment Variables
```bash
cp .env.example .env
# Edit .env with your values:
# - GOOGLE_PLACES_API_KEY
# - FIREBASE_PROJECT_ID
# - FIREBASE_PRIVATE_KEY
# - FIREBASE_CLIENT_EMAIL
```

## Development

### Local Emulator
```bash
npm start
```

This starts:
- Firebase Emulator (local)
- Functions on `http://localhost:5001`
- Firestore on `http://localhost:8080`

### Build TypeScript
```bash
npm run build
```

### View Logs
```bash
firebase functions:log
```

## Deployment

### Deploy to Firebase
```bash
npm run deploy
```

After deployment, you'll get a URL like:
```
https://us-central1-klatchup-dev.cloudfunctions.net/api
```

Use this in your mobile app's `apiConfig.ts`:
```typescript
firebase: {
  baseURL: 'https://us-central1-klatchup-dev.cloudfunctions.net/api',
  ...
}
```

## API Endpoints

All endpoints require Firebase ID Token in `Authorization: Bearer {token}` header.

### Profile APIs
```
POST   /profile                     - Create profile
GET    /profile/{id}                - Get profile by ID
PUT    /profile/{id}                - Update profile
DELETE /profile/{id}                - Delete profile
GET    /profile/mobile/{mobile}     - Get by phone number
GET    /profile/place/{location}    - Find by location
GET    /profile/friends/{id}        - Get friend requests
```

### Location APIs
```
POST   /location                    - Search nearby places
```

### Check-in APIs
```
GET    /checkin/{locationId}        - Get users at location
POST   /checkin                     - Check-in user
DELETE /checkin/{profileId}         - Check-out user
```

## Database Schema

### Firestore Collections

**profiles**
```
{
  profileId: string
  name: string
  mobile: string
  birthDate: string
  gender: string
  interests: [{name: string, subInterest: string}]
  city: string
  bio: string
  profilePicture: string
  showPictures: [{priority: number, path: string}]
  work: string
  education: string
  currentLocation: {placeName, lat, long}
  friendRequest: {user_ids: []}
  friends: {user_ids: []}
  isActive: boolean
  isDeleted: boolean
  createdAt: timestamp
}
```

**checkIns**
```
{
  locationId: string
  profileId: string
  placeName: string
  checkedInAt: timestamp
}
```

## Switching Between Firebase and AWS

### In Mobile App
Change ONE line in `src/services/apiConfig.ts`:

```typescript
// Use Firebase (RECOMMENDED):
export const API_PROVIDER = 'firebase';

// Use AWS (FALLBACK):
export const API_PROVIDER = 'aws';
```

That's it! Restart app and it switches backends.

## Testing

### Postman Collection
```bash
# Export Firebase Functions URLs to Postman
firebase functions:log --inspect
```

### Manual Testing
1. Login via mobile app
2. Complete profile creation
3. Check Firebase Console → Firestore → profiles collection
4. Verify profile data is created

## Troubleshooting

### "401 Unauthorized"
- Check Firebase token is valid
- Re-login in mobile app

### "404 Not Found"
- Verify Firebase Functions deployed
- Run `firebase deploy` again

### Slow Responses
- Check Cold Start time (first request after deploy)
- Monitor Firebase Console → Functions

### Image Upload Fails
- Verify Firebase Storage enabled
- Check Storage Bucket rules allow write

## Monitoring

### Firebase Console
- Functions: Monitor invocations, errors, performance
- Firestore: Check collection sizes, queries
- Storage: Monitor upload/download metrics

### Local Logs
```bash
firebase functions:log
```

## Support

For issues:
1. Check Firebase Console for error logs
2. Verify environment credentials
3. Test with Postman/cURL
4. Fall back to AWS if needed

---

**Status:** ✅ Ready for deployment  
**Last Updated:** Feb 2026  
**Maintainer:** Pavan Kumar
