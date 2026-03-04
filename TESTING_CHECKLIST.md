# ✅ Complete Testing Checklist - Klatchup Location-Based Check-in

---

## 🎯 Phase 1: App Reload & UI Component Test

### Step 1: Reload App Code
- [ ] Press `rr` in Metro terminal to reload
- [ ] OR: Shake device > Tap "Reload" 
- [ ] App should reload and load new components

**Expected Result**: App loads without crashes, new imports are loaded

---

## 🎯 Phase 2: People Tab Navigation Test

### Step 2: Navigate to People Tab
- [ ] Tap bottom navigation to "Find near you!" screen
- [ ] Look for tabs: "🏪 Places" and "👥 People"
- [ ] Click on "👥 People" tab

**Expected Result**: 
- Tab highlights (blue background)
- New "Check In Here" button should appear at the top
- Empty people list shows "No people found nearby" message

---

## 🎯 Phase 3: Check-In Button Test

### Step 3: Test Check-In Button
- [ ] Look at the blue button that says "Check In Here"
- [ ] Tap the "Check In Here" button
- [ ] Watch for Alert popup or status change
- [ ] Button text should change to "✓ Checked In" with red background

**Console Logs to Watch**:
```
✅ checkInAPI called with: {placeName, latitude, longitude}
📍 Location tracking started
🔍 Searching nearby users at 18.5912, 73.8235
```

**Expected Result**: 
- Button background changes to red
- Button text becomes "✓ Checked In"
- Console shows check-in success
- Location tracking starts (you'll see periodic location updates)

---

## 🎯 Phase 4: People List Discovery Test

### Step 4: Search for People After Check-In
- [ ] Tap "Search People" button below the check-in button
- [ ] Wait 2-3 seconds for API response
- [ ] People list should populate with users

**Console Logs to Watch**:
```
✅ getOnlineUsersAtPlaceRequest: McDonald's - Hijewadi Happiness Street
📍 API Response from online-at-place: {onlineUsers: Array(10), ...}
✅ getOnlineUsersAtPlaceSuccess - onlineUsers length: 10
✅ Online users at place updated: 10 users
📍 Valid users after filtering: 10
```

**Expected Result**: 
- FlatList populated with 10+ users:
  - Priya Singh
  - Raj Patel
  - Anjali Sharma
  - Vikram Desai
  - Neha Gupta
  - Arjun Kumar
  - Pooja Reddy
  - Rohit Singh
  - Divya Nair
  - Aman Verma
- Each user shows: name, profile picture, age, interests (if available)

---

## 🎯 Phase 5: Auto-Location Tracking Test

### Step 5: Monitor Location Tracking
- [ ] Keep the app open with check-in active
- [ ] Watch Metro console for location updates every 30 seconds
- [ ] Console should show:
```
📍 Location updated: 18.5912, 73.8235
```

**Expected Result**: Logs appear periodically (roughly every 30 seconds)

---

## 🎯 Phase 6: Auto-Checkout Test (1km Threshold)

### Step 6: Test Auto-Checkout at 1km
**For Android Emulator**:
- [ ] Open Android Studio AVD Manager
- [ ] Click expanded controls menu (>)
- [ ] Scroll down to "Location" section
- [ ] Change latitude to `18.5` and longitude to `74.8` (roughly 1km away)
- [ ] Click "Set Location"
- [ ] Watch Metro console

**Console Logs to Watch**:
```
⚠️ Auto-checkout: User [id] moved X.XXkm away from McDonald's - Hijewadi Happiness Street
```

**Expected Result**:
- Within 30 seconds, console shows auto-checkout
- Button resets to "Check In Here" (blue background)
- People list shows "No people found"
- Location tracking stops

---

## 🎯 Phase 7: User Profile Navigation Test

### Step 7: Click on User Profile
**If people list shows users**:
- [ ] Tap on one of the user cards
- [ ] Should navigate to UserProfile screen
- [ ] See user details: name, bio, interests, age, profile picture

**Expected Result**: User profile screen loads with all details displayed

---

## 🎯 Phase 8: Check-Out Test

### Step 8: Test Manual Check-Out
- [ ] Tap the "✓ Checked In" button (now red) to check out
- [ ] Alert should appear: "Checked out from location"
- [ ] Button reverts to "Check In Here" (blue)
- [ ] People list shows empty

**Expected Result**: 
- Button changes back to blue "Check In Here"
- Location tracking stops
- People list hidden/empty

---

## 🎯 Phase 9: Chat Readiness Test

### Step 9: Verify Chat Infrastructure
**Backend Chat Endpoints** (verify with curl):
```bash
# Verify chat endpoints exist (these require authenticated tokens from app)
curl https://api-zajzlo33xa-uc.a.run.app/health
# Expected: {"status": "OK", "timestamp": "..."}
```

**Expected Result**: Backend is responding, endpoints are deployed

---

## 🎯 Quality Assurance Checklist

### Performance
- [ ] App loads within 3 seconds
- [ ] Check-in completes within 1 second
- [ ] People list loads within 2 seconds
- [ ] No crashes or warnings in console

### Data Integrity
- [ ] People list shows exactly 10 dummy users
- [ ] All users have required fields (name, profilePicture, interests)
- [ ] User data matches backend response

### UX/UI
- [ ] Check-in button clearly visible and responsive
- [ ] People list renders without layout issues
- [ ] Buttons respond to taps immediately
- [ ] Navigation flows smoothly

### Error Handling
- [ ] No "Cannot read property 'profileId'" errors
- [ ] Graceful handling if API is slow
- [ ] Proper error messages if check-in fails
- [ ] Empty state messages display correctly

---

## 📋 Debug Command Reference

### If people list is empty:
```bash
# Check all profiles exist
curl https://api-zajzlo33xa-uc.a.run.app/profile/all | jq '.count'

# Expected: 11 (10 dummy + 1 real user)
```

### If check-in button doesn't work:
```bash
# Check Metro console for errors
# Look for:
# - "TypeError: Cannot read property..."
# - "Failed to check in"
# - Network errors
```

### If location tracking not working:
```bash
# Check permission grants:
# Android: Settings > Apps > Klatchup > Permissions > Location
# iOS: Settings > Klatchup > Location
```

---

## ✅ Success Criteria

All of the following must pass:

1. ✅ App reloads without crashes
2. ✅ Check-in button appears on People tab
3. ✅ Button toggles between "Check In Here" and "✓ Checked In"
4. ✅ After check-in, "Search People" returns 10+ users
5. ✅ All returned users have valid profileId, name, and photo
6. ✅ Location console logs show periodic updates (every ~30 seconds)
7. ✅ Auto-checkout triggers when moved >1km away
8. ✅ Check-out button works and resets state
9. ✅ No TypeScript errors or runtime crashes
10. ✅ Firebase backend deployed successfully with chat endpoints

---

## 🎉 Next Phase: Real-Time Chat

**After confirming all tests pass**, the chat system is ready:
- ✅ Send message endpoint: `/chat/send`
- ✅ Fetch messages endpoint: `/chat/messages`
- ✅ Get conversations endpoint: `/chat/conversations`
- ✅ Mark as read endpoint: `/chat/mark-read`

**Features**:
- Location-constrained messaging (only chat if at same place)
- Auto-timeout when either user checks out
- Message persistence in Firestore
- Read status tracking

---

## 📞 Support

If you encounter issues:
1. **Check Metro console** for error messages
2. **Verify device location permissions** are granted
3. **Check backend logs**: `firebase functions:log -n 100`
4. **Restart Metro**: Press `Shift + M` then select new terminal
5. **Hard reload app**: Shake device > Reload or `adb shell input text "c"`

---

**Status**: ✅ READY FOR TESTING
**Last Updated**: Feb 28, 2026, 14:15 UTC
**Backend URL**: https://api-zajzlo33xa-uc.a.run.app
