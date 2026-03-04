# 🔧 Troubleshooting Guide - Script Loading & Token Errors

## Issue 1: "Unable to Load Script" Error ❌

### Symptoms:
- Red error screen on device
- "Unable to load script from assets or URL"
- Metro bundler errors listed

### Root Causes & Solutions:

#### Solution 1A: Metro Bundler Not Running
```bash
# Check if Metro is running
lsof -i :8081

# If not, start it:
cd /Users/pavan/Documents/klatchup/klatchup
chmod +x start-metro.sh
./start-metro.sh

# OR
npm start -- --reset-cache
```

#### Solution 1B: ADB Connection Issue
```bash
# Restart ADB
adb kill-server
adb start-server
adb devices

# Should show: c9e56dd8        device

# Setup reverse proxy
adb reverse tcp:8081 tcp:8081
```

#### Solution 1C: Port 8081 Already in Use
```bash
# Find what's using port 8081
lsof -i :8081

# Kill it
kill -9 <PID>

# Or automatic:
lsof -i :8081 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

#### Solution 1D: Device Not Connected via USB
```bash
# Check connection
adb devices

# Enable USB debugging on device:
1. Settings → Developer options → USB debugging (ON)
2. Connect cable and select "Allow USB debugging"
3. adb devices should show device

# If still not showing:
adb usb
adb reboot
```

### Action Steps:
```bash
# 1. Check Metro
lsof -i :8081

# 2. If not running, check for errors:
npm start -- --verbose --reset-cache 2>&1 | head -50

# 3. Check ADB
adb devices

# 4. Restart if needed
adb kill-server && adb start-server && adb devices
```

---

## Issue 2: "Firebase ID Token Expired" ❌

### Symptoms:
- Profile creation fails
- "401 Unauthorized" errors
- Token expiration messages in logs

### Root Causes:
- Token obtained before OTP verification
- Token cached too long
- User session expired
- Backend rejecting expired tokens

### Solutions:

#### Solution 2A: Force Token Refresh
**Code Fix:** Already implemented in updated code!
- `getFirebaseToken(true)` now forces refresh
- Auto-retry on 401 errors in sagas
- Token stored in Redux state

#### Solution 2B: Ensure OTP Verification Completes
```typescript
// Step 1: Send OTP
await signInWithPhoneNumber(phone)

// Step 2: Wait for OTP response from user
Enter OTP on device

// Step 3: Verify OTP with Firebase
await confirm.confirm(otpCode)  // This creates the session!

// Step 4: NOW fetch profile
// Token will be fresh because user just signed in
```

#### Solution 2C: Check Token Validity on Device
```bash
# Monitor device logs during profile creation
adb logcat -d | grep -i "firebase\|token\|auth" | tail -30
```

### Code Changes Made:

**File:** `src/services/api.ts`
```typescript
// NEW: Force token refresh on fetch
export async function getFirebaseToken(forceRefresh: boolean = false)
// NOW: No fallback tokens - proper error handling
export async function fetchAuthToken()
```

**File:** `src/sagas/profileSaga.ts`
```typescript
// NEW: Automatic retry on 401
if (apiError.message && apiError.message.includes('401')) {
  // Get fresh token and retry
}
```

---

## Complete Debug Workflow

### Step 1: Start Metro Bundler
```bash
cd /Users/pavan/Documents/klatchup/klatchup
./start-metro.sh

# Wait for message: "Welcome to React Native v0.77"
# "Metro is running on http://localhost:8081"
```

### Step 2: Verify Device Connection
```bash
adb devices
# Should show: c9e56dd8        device

adb reverse tcp:8081 tcp:8081
adb shell input text "test"  # Quick test
```

### Step 3: Trigger Reload on Device
```bash
# Option A: Press 'r' in Metro terminal
# Result: App reloads instantly

# Option B: On device, double-tap R

# Option C: Shake device and select "Reload"
```

### Step 4: Monitor Logs During Testing
```bash
# In separate terminal:
adb logcat -d | grep -i "error\|firebase\|token\|script" | tail -50

# Or continuous:
adb logcat | grep -iE "error|firebase|token|script"
```

### Step 5: Test Auth Flow
1. **Phone Entry**: Enter phone number (919876543210)
2. **OTP Send**: Should receive SMS via Firebase
3. **OTP Verify**: Enter 6-digit code
4. **After Verify**: 
   - Check logs for "Firebase token obtained: success"
   - Device should navigate to profile creation
   - Token should be fresh (just obtained)

### Step 6: Profile Creation
1. **Fill Form**: Name, date, gender, city, interests
2. **Bio Entry**: At least 20 characters
3. **Submit**: Click Continue
4. **Monitor**:
   - Should see "Inserting profile" in logs
   - Backend should respond with profile data
   - Should navigate to Home

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Unable to load script" | Metro not running | `./start-metro.sh` |
| "Cannot connect to Metro" | Port 8081 blocked | `adb reverse tcp:8081 tcp:8081` |
| "401 Unauthorized" | Token expired | Token auto-refreshes now |
| "No user logged in" | OTP not verified | Complete OTP verification first |
| "Profile not found" | Haven't created profile yet | Create profile in profile creation screen |

---

## Quick Recovery Commands

```bash
# Complete reset:
adb kill-server
adb start-server
lsof -i :8081 | awk 'NR>1 {print $2}' | xargs kill -9 || true
sleep 2
cd /Users/pavan/Documents/klatchup/klatchup
./start-metro.sh

# On device:
1. Force stop app: Settings → Apps → klatchup → Force Stop
2. Clear cache: Storage → Clear Cache
3. Open app again
4. Metro will reload automatically
```

---

## Testing Checklist

- [ ] Metro bundler running (`./start-metro.sh`)
- [ ] Device connected (`adb devices`)
- [ ] USB reverse proxy active (`adb reverse tcp:8081 tcp:8081`)
- [ ] Phone number entered (919876543210)
- [ ] OTP received and verified
- [ ] Profile creation form opens
- [ ] Profile data submitted successfully
- [ ] No 401 errors in logs
- [ ] Navigated to home screen

---

## If Still Having Issues

### Check These Files:
1. **src/services/api.ts** - Token fetch logic ✅ Updated
2. **src/sagas/profileSaga.ts** - Token refresh retry ✅ Updated
3. **metro.config.js** - Metro configuration ✅ Updated
4. **Gemfile** - Ruby version conflict ✅ Fixed
5. **android/gradle.properties** - Memory optimization ✅ Done

### Verify These Are Running:
```bash
ps aux | grep -E "java|gradle" | grep -v grep    # Build
ps aux | grep -E "node|npx|metro" | grep -v grep # Metro
adb devices                                        # Device
curl https://api-zajzlo33xa-uc.a.run.app/health  # Backend
```

### Last Resort Actions:
```bash
# Clean everything and rebuild
cd android
./gradlew clean
cd ..
npm start -- --reset-cache

# Or reboot device
adb reboot
```

---

**Both fixes are now in place. Metro bundler should start cleanly, and Firebase tokens will auto-refresh on expiration!** 🚀
