# Profile Creation Testing Guide

## 📊 Current Status

- **Backend URL**: https://api-zajzlo33xa-uc.a.run.app
- **Health Check**: ✅ Working
- **API Provider**: Firebase Cloud Run
- **Mobile Base URL Updated**: ✅ Yes

## 🔍 Testing Steps

### 1. Test Backend  Health
```bash
curl -s https://api-zajzlo33xa-uc.a.run.app/health | jq .
```
**Expected Response**: `{ "status": "OK", "timestamp": "..." }`

### 2. Verify Mobile App is Using Correct Backend
Check that your app logs show:
```
Active Provider: FIREBASE
Base URL: https://api-zajzlo33xa-uc.a.run.app
```

### 3. Trace Profile Creation Flow
When creating a profile, watch the console logs for:
- ✅ `========== PROFILE SAGA START ==========`
- ✅ `Token from state: Found` (or "Getting new token...")
- ✅ `========== PROFILE CREATION REQUEST ==========`
- ✅ `Response status: 201` (success) or error status

### 4. Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `404 Not Found` | Endpoint not accessible | Verify Cloud Run URL is correct |
| `401 Unauthorized` | Invalid/expired Firebase token | Re-login to app |
| `400 Bad Request` | Missing required fields | Ensure all form fields filled |
| `500 Internal Server Error` | Backend/Firestore issue | Check backend logs below |

## 📱 Mobile App Changes Made

1. **API Configuration Updated**
   - File: `src/services/apiConfig.ts`
   - Changed baseURL to: `https://api-zajzlo33xa-uc.a.run.app`

2. **Enhanced Error Logging**
   - File: `src/services/api.ts`
   - Added detailed logs for profile creation requests
   - File: `src/sagas/profileSaga.ts`
   - Added detailed logs for saga execution

3. **What To Check In Logs**
   - Open browser console or Android logcat
   - Search for "PROFILE CREATION REQUEST"
   - Look for actual response status and error messages

## 🧪 Quick Test with cURL (requires Firebase token)

```bash
# Get a Firebase token (from your mobile app console logs)
TOKEN="your_firebase_token_here"

# Test profile creation endpoint
curl -X POST https://api-zajzlo33xa-uc.a.run.app/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "profile": {
      "name": "Test User",
      "mobile": "+1234567890",
      "birthDate": "1990-01-01",
      "gender": "Male",
      "city": "Test City",
      "bio": "This is a test bio with enough characters to pass validation requirement of at least twenty characters long"
    }
  }'
```

## 🛠️ If Still Getting 404/505 Error

1. **Rebuild the mobile app** with latest code:
   ```bash
   # Android
   cd android
   ./gradlew clean assembleDebug
   
   # Then reinstall APK
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Check backend is deployed**:
   ```bash
   gcloud functions describe api --region=us-central1 --runtime nodejs18
   ```

3. **Check Firestore database**:
   - Go to Firebase Console
   - Select `klatchup-pavan2` project
   - Verify `klatchupdb` Firestore database exists
   - Check Security Rules are deployed

4. **Verify authentication**:
   - Make sure you're logged in with valid phone
   - Check Firebase token is being generated correctly

## 📋 Profile Creation Requirements

**Minimum required fields**:
- `name` - First name
- `birthDate` - Format: YYYY-MM-DD  
- `gender` - Male/Female/Other
- `city` - City name
- `bio` - At least 20 characters
- `mobile` - Phone number (auto-filled from authentication)

**All other fields** have default values in backend.

## ✅ Success Indicators

When profile creation works:
1. No error dialog appears
2. App automatically navigates to Home screen
3. Your profile appears in the app
4. Firebase console shows new document in `profiles` collection

## 🐛 Debug Logs To Check

**On Mobile (React Native)**:
- Search console for "PROFILE CREATION REQUEST"
- Look at the "Response status" line
- Check for "Auth token valid" confirmation

**On Backend** (Cloud Run logs):
- Command: `gcloud functions logs read api --region=us-central1 --limit 50`
- Should see "POST /profile - Request received"
- Look for any Firestore write errors

