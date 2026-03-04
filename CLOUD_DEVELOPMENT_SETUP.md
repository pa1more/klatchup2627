# 🚀 Cloud-Based Development Environment Setup

## 📊 Current Infrastructure Status

### ✅ Already Live & Configured

1. **Firebase Project**: `klatchup-pavan2`
   - Region: `us-central1`
   - Status: ACTIVE

2. **Backend API** (Cloud Run) ✅ LIVE
   ```
   URL: https://api-zajzlo33xa-uc.a.run.app
   Status: Responding (verified with health check)
   ```

3. **Firestore Database** ✅ LIVE
   ```
   Database ID: klatchupdb
   Location: us-central1
   Security Rules: Deployed
   ```

4. **Realtime Database** ✅ LIVE
   ```
   URL: https://klatchup-pavan2-default-rtdb.firebaseio.com
   Location: us-central1
   ```

5. **Firebase Authentication** ✅ LIVE
   ```
   Phone Auth: Enabled
   Token Verification: Working
   ```

6. **Cloud Storage** ✅ LIVE
   ```
   Bucket: gs://klatchup-pavan2.firebasestorage.app
   Access: Verified
   ```

---

## 🏗️ What We Need to Deploy

### Option 1: Cloud Run Metro Server (Recommended for Team Development)

**Pros:**
- Centralized development server
- Multiple developers can connect
- Automatic rebuild on code push
- No need for local Metro running
- Live log streaming

**Cons:**
- Requires container setup
- Need to manage Cloud Run instance
- May have latency for hot reload

### Option 2: Hybrid Approach (Recommended for Now)

**Setup:**
- Keep Metro running locally (for development speed)
- All backends already live
- Deploy production APKs to Cloud Storage
- Team members download pre-built APKs

**Pros:**
- Fastest development cycle
- No cloud infrastructure complexity
- Everything backend-wise already live
- Quick iteration

**Cons:**
- Need local Metro running
- Harder for remote team members

---

## ✅ What's ALREADY Live (No Action Needed)

### Backend API
```bash
# Health check
curl https://api-zajzlo33xa-uc.a.run.app/health

# Works with live database and auth
```

### Database (Firestore)
```
✅ Accessible to Cloud Functions
✅ Security rules deployed
✅ Real-time updates enabled
✅ Indexes configured
```

### Realtime Database
```
✅ Connected to backend
✅ Real-time sync enabled
✅ Security rules active
```

### Authentication
```
✅ Phone auth working
✅ Firebase tokens verified
✅ Token refresh implemented
✅ Properly integrated with backend
```

---

## 🔧 Option 1: Deploy Metro Server to Cloud Run

### Step 1: Create Metro Server Dockerfile

**File**: `Dockerfile.metro`
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app code
COPY . .

# Expose Metro port
EXPOSE 8081

# Start Metro bundler
CMD ["npm", "start", "--", "--port", "8081", "--host", "0.0.0.0"]
```

### Step 2: Configure Metro for Cloud

**File**: `metro.config.js` (already configured but verify)
```javascript
module.exports = {
  watchFolders: [__dirname],
  transformer: {
    getTransformOptions: async () => ({
      transform: { experimentalImportSupport: false, inlineRequires: true },
    }),
  },
  maxWorkers: 4,
  timeout: 120000,
  projectRoot: __dirname,
};
```

### Step 3: Build and Deploy to Cloud Run

```bash
# Build Docker image
docker build -f Dockerfile.metro -t metro-server .

# Tag for GCR
docker tag metro-server:latest gcr.io/klatchup-pavan2/metro-server:latest

# Push to GCR
docker push gcr.io/klatchup-pavan2/metro-server:latest

# Deploy to Cloud Run
gcloud run deploy metro-server \
  --image gcr.io/klatchup-pavan2/metro-server:latest \
  --platform managed \
  --region us-central1 \
  --memory 4Gi \
  --allow-unauthenticated \
  --timeout 3600 \
  --set-env-vars NODE_ENV=development
```

### Step 4: Configure Mobile App to Use Cloud Metro

**File**: `metro.config.js` (for Cloud Metro URL)
```javascript
module.exports = {
  project: { deps: {} },
  transformer: {
    getTransformOptions: async () => ({
      transform: { experimentalImportSupport: false, inlineRequires: true },
    }),
  },
  server: {
    // Point to cloud Metro for remote development
    enhanceMiddleware: middleware => {
      return (req, res, next) => {
        return middleware(req, res, next);
      };
    },
  },
  maxWorkers: 4,
};
```

### Step 5: Update App Configuration

**File**: `src/services/devConfig.ts` (new file)
```typescript
export const DEV_SERVER_CONFIG = {
  // For local development
  LOCAL: {
    metroUrl: 'http://localhost:8081',
    bundlerHost: 'localhost',
    bundlerPort: 8081,
    mode: 'local',
  },
  
  // For cloud development
  CLOUD: {
    metroUrl: 'https://metro-server-xxxxx.run.app', // Update with actual URL
    bundlerHost: 'metro-server-xxxxx.run.app',
    bundlerPort: 443,
    mode: 'cloud',
    useHttps: true,
  },
};

// Detect current environment
export const getCurrentDevConfig = () => {
  const env = process.env.REACT_NATIVE_DEBUGGER_HOST;
  
  // If debugger is accessible, use cloud
  if (env?.includes('cloud')) {
    return DEV_SERVER_CONFIG.CLOUD;
  }
  
  // Default to local
  return DEV_SERVER_CONFIG.LOCAL;
};
```

---

## 🌐 Option 2: Hybrid Cloud Development (Recommended)

### Current Setup (Already Working)

**What's already deployed:**
```
✅ API Backend: Cloud Run
✅ Firestore: Live database
✅ Realtime DB: Live connection
✅ Authentication: Firebase Auth
✅ Storage: Cloud Storage
```

**What to keep local:**
```
📱 Metro Bundler: Run locally (fastest iteration)
🔄 Development: npm start locally
📦 APK Building: Gradle locally
```

### How to Use Hybrid Setup

#### For Individual Development (Current):
```bash
# Terminal 1: Start Metro
cd /Users/pavan/Documents/klatchup/klatchup
npm start

# Terminal 2: Build and test
cd android
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

#### For Team Development:
```bash
# Share pre-built APK via Cloud Storage
gsutil cp app-debug.apk gs://klatchup-pavan2.firebasestorage.app/dev-builds/

# Team members download and install
adb install app-debug.apk
```

---

## 🚀 Complete Deployment Checklist

### Phase 1: Verify Everything is Live ✅
- [x] Backend API running and responding
- [x] Firestore database live
- [x] Realtime database live
- [x] Authentication working
- [x] Cloud Storage accessible

### Phase 2: Local Development (Current) ✅
- [x] Metro bundler working
- [x] APK building successfully
- [x] App connecting to live backend
- [x] All APIs pointing to Cloud Run
- [x] Database operations working

### Phase 3: Optional - Cloud Metro (For Team)
- [ ] Create Dockerfile.metro
- [ ] Build Docker image
- [ ] Deploy to Cloud Run
- [ ] Update client configuration
- [ ] Test with cloud Metro

### Phase 4: Production Build Pipeline
- [ ] Set up Cloud Build triggers
- [ ] Configure automated testing
- [ ] Setup release builds
- [ ] Deploy signed APKs

---

## 📝 Quick Command Reference

### Check Backend Status
```bash
curl https://api-zajzlo33xa-uc.a.run.app/health | jq .
```

### Check Database Connection
```bash
curl -X GET 'https://firestore.googleapis.com/v1/projects/klatchup-pavan2/databases/(default)/documents/profiles' \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" | jq .
```

### View Cloud Run Logs
```bash
gcloud functions logs read api --region=us-central1 --limit=50
```

### Deploy Updated Backend
```bash
cd firebase-backend
npm run deploy
```

### Build Local APK
```bash
cd android
./gradlew assembleDebug
```

### Deploy APK to Device
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 Recommendation

**For NOW:** Continue with Hybrid Approach
1. Metro bundler runs locally (faster development)
2. All backends are live and working
3. Team members use pre-built APKs from cloud storage
4. Get this working first before deploying Metro to cloud

**For LATER:** When ready for full cloud dev
1. Deploy Metro to Cloud Run
2. Set up cloud build pipeline
3. Implement automated testing
4. Full CI/CD pipeline

---

## ✅ Everything You Need Is Already Working

```
Frontend (Local Metro): 🏃‍♂️ Running locally for fast iteration
├─ Backend API: ✅ https://api-zajzlo33xa-uc.a.run.app  
├─ Firestore: ✅ klatchupdb (us-central1)
├─ Realtime DB: ✅ klatchup-pavan2-default-rtdb
├─ Authentication: ✅ Firebase Auth (phone)
└─ Storage: ✅ gs://klatchup-pavan2.firebasestorage.app
```

**You can start testing with the current setup!**
- App connects to live backend
- Database is live
- Authentication is live
- Everything needed for development is working

