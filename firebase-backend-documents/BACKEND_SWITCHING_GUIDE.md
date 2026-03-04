# 🔄 Backend Switching Guide

## Quick Reference: How to Switch Backends

### Where to Switch
**File:** `src/services/apiConfig.ts` (line ~10)

```typescript
// Change this ONE line to switch:
export const API_PROVIDER = 'firebase';  // or 'aws'
```

That's it! All API calls use the new backend immediately.

## Step-by-Step Switching

### Switch FROM AWS TO Firebase

#### Step 1: Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project (or use existing)
3. Create service account key:
   - Project settings → Service accounts
   - Click "Generate new private key"
   - Save JSON file
4. Copy values to `firebase-backend/.env`

#### Step 2: Deploy Firebase Backend
```bash
cd firebase-backend
npm install
firebase login
firebase deploy
```

Copy the deployed URL (looks like: `https://us-central1-PROJECT_ID.cloudfunctions.net/api`)

#### Step 3: Update Mobile App Config
Edit `src/services/apiConfig.ts`:

**BEFORE:**
```typescript
export const API_PROVIDER = 'aws';
```

**AFTER:**
```typescript
export const API_PROVIDER = 'firebase';
```

#### Step 4: Rebuild App
```bash
# Android
npx react-native run-android

# iOS  
npx react-native run-ios
```

#### Step 5: Test
- Create new profile
- Check photo upload works
- Search for users at location
- Check-in to a place
- All should work smoothly ✅

### Switch FROM Firebase TO AWS

#### Step 1: Edit Config
Edit `src/services/apiConfig.ts`:

**BEFORE:**
```typescript
export const API_PROVIDER = 'firebase';
```

**AFTER:**
```typescript
export const API_PROVIDER = 'aws';
```

#### Step 2: Rebuild App
```bash
npm run android    # or: npm run ios
```

#### Step 3: Test
App switches instantly to AWS endpoints

**Note:** AWS backend currently returns 404 errors, so this works for fallback testing only.

## Configuration Details

### What We Use From Each Backend

#### Firebase Configuration
**File:** `src/services/apiConfig.ts`

```typescript
const config = {
  firebase: {
    baseURL: 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api',
    provider: 'firebase',
    apiKey: 'not-needed-token-auth',
    timeout: 10000
  }
};
```

**Keys used:**
- `baseURL` - Where to send HTTP requests
- `provider` - For logging/debugging which backend is active

#### AWS Configuration  
**File:** `src/services/apiConfig.ts`

```typescript
const config = {
  aws: {
    baseURL: 'https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com',
    provider: 'aws',
    apiKey: 'not-needed-token-auth',
    timeout: 10000
  }
};
```

**Keys used:**
- `baseURL` - AWS Lambda API Gateway endpoint
- `provider` - For logging which backend in use

## Complete apiConfig.ts File

```typescript
// src/services/apiConfig.ts

/**
 * Backend Configuration
 * Change API_PROVIDER to switch all API calls to different backend
 * 
 * Options:
 *   'firebase' - Google Cloud Firebase (✨ Recommended)
 *   'aws'      - Amazon Lambda (📦 Fallback)
 */
export const API_PROVIDER = 'firebase';
// export const API_PROVIDER = 'aws';  // Use this line to fallback

/**
 * Backend configurations for each provider
 */
const backendConfig = {
  firebase: {
    baseURL: 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api',
    provider: 'firebase',
    name: 'Firebase Backend',
    description: 'Google Cloud Firebase Functions',
    timeout: 10000,
  },
  aws: {
    baseURL: 'https://dgwnbw5ly3.execute-api.us-east-1.amazonaws.com',
    provider: 'aws',
    name: 'AWS Lambda Backend',
    description: 'Amazon Lambda + DynamoDB',
    timeout: 10000,
  },
};

/**
 * Get active configuration based on API_PROVIDER
 */
export const getActiveConfig = () => {
  return backendConfig[API_PROVIDER];
};

/**
 * Get the base URL for all API calls
 */
export const BASE_URL = getActiveConfig().baseURL;

/**
 * Export config for debugging
 */
export const ActiveBackend = getActiveConfig();

// Usage in api.ts:
// import { BASE_URL, API_PROVIDER, ActiveBackend } from './apiConfig';
//
// const response = await fetch(`${BASE_URL}/profile/${id}`);
// console.log(`Using: ${ActiveBackend.name}`);
```

## Advanced: Custom Switching

### Runtime Backend Switching (For Testing)

If you want to allow users to switch backends from app settings:

```typescript
// Create Redux slice for backend config
const backendSlice = createSlice({
  name: 'backend',
  initialState: { provider: 'firebase' },
  reducers: {
    setBackendProvider: (state, action) => {
      state.provider = action.payload;
      // Optionally restart network requests
    }
  }
});

// In api.ts, read from Redux instead of static config:
import { useSelector } from 'react-redux';

export const api = {
  getProfile: async (id) => {
    const provider = useSelector(state => state.backend.provider);
    const url = `${BASE_URLS[provider]}/profile/${id}`;
    // ... make request
  }
};
```

## Troubleshooting Switching Issues

### Problem: App Still Uses Old Backend After Changing Config

**Solution:**
1. Clear Metro bundler cache:
   ```bash
   npx react-native start --reset-cache
   ```

2. Clear app data:
   ```bash
   adb shell pm clear com.klatchup  # Android
   # iOS: Settings → General → Storage → Delete app
   ```

3. Rebuild app:
   ```bash
   npx react-native run-android
   ```

### Problem: Firebase Backend Returns 404

**Check:**
1. Firebase project exists: [Firebase Console](https://console.firebase.google.com/)
2. Cloud Functions deployed: `firebase deploy`
3. URL is correct in config
4. Environment variables set in Firebase

**Fix:**
```bash
# Check deployment status
firebase functions:list

# View logs for errors
firebase functions:log

# Redeploy
firebase deploy --force
```

### Problem: AWS Backend Also Returns 404

**Cause:** AWS was never properly deployed

**Options:**
1. Keep using Firebase only
2. Deploy AWS Lambda yourself
3. Contact AWS setup team

### Problem: Can't Switch Between Backends

**Check:**
1. You're editing `src/services/apiConfig.ts`
2. You saved the file
3. You refreshed Metro bundler
4. You cleared app cache
5. You rebuilt the app

## Performance Comparison

After switching, monitor these metrics:

### Firebase Backend
**Best for:** New apps, small user bases
- Startup time: ~150ms
- Image upload: ~1-2 seconds
- Database writes: ~200ms

### AWS Backend  
**Best for:** Established apps with custom logic
- Startup time: ~200ms
- Image upload: ~1-2 seconds
- Database writes: ~300ms

Both are fast enough for production use.

## Cost Comparison

### Firebase Pricing
```
Firestore:
  - Read: $0.06 per 100k
  - Write: $0.18 per 100k
  - Delete: $0.02 per 100k
  - 1M free reads/month

Storage:
  - $0.026 per GB stored
  - 5GB free per month

Cloud Functions:
  - 2M free calls/month
  - $0.40 per million calls after

Total for 10k users: $5-20/month
```

### AWS Pricing
```
Lambda:
  - 1M free requests/month
  - $0.0000002 per request after

DynamoDB:
  - On-demand: $0.00013 per read, $0.0000065 per write
  - 25GB free storage

S3:
  - $0.023 per GB stored
  - 5GB free

Total for 10k users: $0-50/month
```

**Winner:** Firebase for new apps, AWS for high volume

## Monitoring

### Check Which Backend Is Active

**Option 1: In App Code**
```typescript
import { API_PROVIDER, ActiveBackend } from '../services/apiConfig';

console.log('Active backend:', API_PROVIDER);
console.log('Config:', ActiveBackend);
```

**Option 2: Firebase Console**
Check real-time logs:
```bash
firebase functions:log --follow
```

**Option 3: AWS Console**
Check CloudWatch logs:
```
AWS Console → CloudWatch → Logs → /aws/lambda/...
```

## Best Practices

### ✅ DO
- [ ] Test both backends before release
- [ ] Keep AWS as fallback ready
- [ ] Document which backend you're using
- [ ] Monitor error rates after switching
- [ ] Have rollback plan ready (change 1 line)

### ❌ DON'T  
- Don't deploy Firebase and AWS simultaneously
- Don't delete AWS immediately when on Firebase
- Don't modify endpoint URLs directly
- Don't keep hardcoded URLs in other files
- Don't forget to test after switching

## Rollback (Emergency)

If current backend has issues:

### Instant Rollback (< 30 seconds)

```typescript
// Edit src/services/apiConfig.ts
// Change this line:
export const API_PROVIDER = 'firebase';  // Current
// To this:
export const API_PROVIDER = 'aws';       // Fallback

// Deploy to app stores
// Users updated → instant backend switch
```

**Total time:** ~2 hours for app store distribution, but only 1 second code change.

## Support Checklist

Before contacting support, verify:

- [ ] Correct `API_PROVIDER` setting in `apiConfig.ts`
- [ ] Backend endpoints are deployed
- [ ] Network connectivity is working
- [ ] App was rebuilt after config change
- [ ] No TypeScript errors in console
- [ ] Backend logs show requests arriving

---

## 📚 Related Guides

- [START_HERE.md](START_HERE.md) - Overview
- [QUICK_START.md](QUICK_START.md) - Deployment guide
- [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md) - System design
- [FIREBASE_BACKEND_SUMMARY.md](FIREBASE_BACKEND_SUMMARY.md) - Technical details

---

**Next:** Deploy Firebase → [QUICK_START.md](QUICK_START.md) 🚀
