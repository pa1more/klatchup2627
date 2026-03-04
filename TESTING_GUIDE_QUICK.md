# 🧪 QUICK TEST GUIDE - VERIFY ALL FIXES

**Updated**: February 28, 2026  
**Expected Time**: 10-15 minutes

---

## ✅ PRE-TEST CHECKLIST

Before testing, make sure:
- [ ] App is running in Metro terminal
- [ ] Device/emulator is connected
- [ ] Location permission is granted
- [ ] You have internet connection
- [ ] Metro shows no compilation errors

**If troubleshooting needed**:
```bash
# Reload app
Press: r r
(in Metro terminal)

# Hard reset if needed
npm start -- --reset-cache
```

---

## 🧪 TEST 1: Geolocation Tracking

**What to verify**: Location tracking works without errors

### Steps:
1. Navigate to **People** tab (👥 icon at bottom)
2. Verify **"Check In Here"** button appears (blue button)
3. Tap the button
4. Device may ask for location permission → **Allow**
5. Button should turn red: **"✓ Checked In"**

### Expected Results:
In Metro console, you should see:
```
🗺️ Starting location tracking service...
📍 Location updated: 18.5912, 73.8235  ← Appears every ~30 seconds
✅ User is checked in at: McDonald's...
```

✅ **PASS** if you see these logs every 30 seconds  
❌ **FAIL** if you see errors or "watchposition is not defined"

---

## 🧪 TEST 2: People List Visibility

**What to verify**: People list populates after check-in

### Steps:
1. After checking in (from Test 1), verify button is red
2. Tap **"🔍 Search People"** button
3. Wait 2-3 seconds for list to load

### Expected Results:
- List shows 10+ people with:
  - ✅ Profile pictures
  - ✅ Names (Priya Singh, Raj Patel, etc.)
  - ✅ Ages
  - ✅ Interests
  - ✅ "Send Request" button

Console should show:
```
👥 nearbyUsersExecuted triggered
👥 nearbyUsers from Redux: [...]
👥 nearbyUsers length: 10
👥 Valid users after filtering: 10
```

✅ **PASS** if 10+ people appear with all details  
❌ **FAIL** if list is empty or people have missing data

---

## 🧪 TEST 3: Check-In Button State Persistence

**What to verify**: Button remembers check-in state

### Steps:
1. Check-in (tap blue button → becomes red)
2. Close app completely
3. Reopen app
4. Navigate to People tab
5. Button should still be red: **"✓ Checked In"**

Console should show:
```
✅ Loaded check-in state: true
```

✅ **PASS** if button is red after reopening  
❌ **FAIL** if button is blue (state was lost)

---

## 🧪 TEST 4: Chat Function - List

**What to verify**: Chat button appears and shows people

### Steps:
1. **Must be checked in** (from Test 1)
2. Look for new orange button: **"💬 Chat at McDonald's..."**
3. Tap the chat button
4. Wait 2-3 seconds for people list to load

### Expected Results:
- Screen shows: "Chat at McDonald's - Hijewadi Happiness Street"
- List displays people with:
  - ✅ Name
  - ✅ Last message (if any)
  - ✅ Timestamp
  - ✅ "Chat" button
- At least 10 people visible

Console should show:
```
📱 Fetching conversations at place: McDonald's...
📱 Conversations response: { conversations: [...], count: 10 }
```

✅ **PASS** if chat list shows 10+ people  
❌ **FAIL** if list is empty or chat button missing

---

## 🧪 TEST 5: Chat Function - Messaging

**What to verify**: Can send/receive messages

### Steps:
1. From chat list (Test 4), tap any person's name
2. Chat screen should open showing:
   - Person's name at top
   - "McDonald's..." location name
   - Empty message area (first chat)
   - Message input box at bottom

### Send a Message:
1. Type a test message: "Hello! Testing chat" 
2. Tap send button (✓ icon)
3. Message should appear in chat bubble
4. Message bubble should be blue (your message)
5. Wait 2 seconds for auto-poll

### Expected Results:
Console shows:
```
📡 Calling getOnlineUsersAPI...
📍 Full API Response...
💬 Sending message to user...
✅ Message sent successfully
```

✅ **PASS** if message appears and sends successfully  
❌ **FAIL** if message doesn't appear or error occurs

---

## 🧪 TEST 6: Auto-Checkout at 1km

**What to verify**: Auto-checkout works when moving >1km

### Steps (Only if using physical device):
1. Start app and check-in
2. Open Maps app in background
3. Simulate location >1km away from McDonald's (18.5912, 73.8235)
4. Return to Klatchup app
5. Watch console

### Expected Results:
Console should show:
```
📍 Location updated with new distance
⚠️ User moved >1km, auto-checking out...
✅ Auto-checkout triggered
``` 

✅ **PASS** if auto-checkout triggers  
❌ **FAIL** if still checked in after moving

*(Can skip this test on emulator)*

---

## 📊 TEST SUMMARY SHEET

| Test | Feature | Status | Notes |
|------|---------|--------|-------|
| 1 | Geolocation Tracking | ⬜ | Every 30 seconds |
| 2 | People List | ⬜ | 10+ people visible |
| 3 | Button Persistence | ⬜ | After app restart |
| 4 | Chat List | ⬜ | Shows people checked-in |
| 5 | Chat Messages | ⬜ | Send/receive working |
| 6 | Auto-Checkout | ⬜ | Physical device only |

---

## 🐛 TROUBLESHOOTING

### Problem: "watchPosition is not defined"
**Solution**: 
```bash
npm start -- --reset-cache
# Then reload with "rr" in Metro
```

### Problem: People list is empty
**Check**:
1. Are you checked-in? (button should be red)
2. Tap "Search People" button
3. Check console for error messages
4. Verify backend is running: `firebase functions:log`

### Problem: Chat button doesn't appear
**Check**:
1. Must be checked-in (red button)
2. Tab must show "People" (not "Places")
3. Scroll down if button is below search button

### Problem: Chat list empty
**Check**:
1. Verify check-in was successful (console shows "Checked in at...")
2. Check backend logs: `firebase functions:log`
3. Make sure location is "McDonald's - Hijewadi Happiness Street"

### Problem: Chat message not sending
**Check**:
1. Both users must be at SAME location
2. Both users must be "checked in" (isActive=true)
3. Check console for error message
4. Verify backend endpoint: `curl https://api-zajzlo33xa-uc.a.run.app/health`

---

## 🔍 CONSOLE LOG REFERENCE

**Easy way to debug**: Search console output for these symbols:

| Symbol | Meaning | Example |
|--------|---------|---------|
| 📍 | Location update | "📍 Location updated: 18.5912, 73.8235" |
| 👥 | People data | "👥 nearbyUsers length: 10" |
| 💬 | Chat action | "💬 Fetching conversations..." |
| 📱 | Chat API call | "📱 API Response from chat/send" |
| ✅ | Success | "✅ Loaded check-in state: true" |
| ❌ | Error | "❌ Error loading conversations: ..." |
| ⚠️ | Warning | "⚠️ Filtered out undefined user" |
| 🔴 | Critical error | "🔴 Fatal: Authentication token missing" |

---

## ✅ ALL TESTS PASSED?

If all 6 tests pass with ✅ status:

```
🎉 SYSTEM IS FULLY OPERATIONAL! 🎉

- Geolocation tracking works
- People discovery functional
- Chat system active
- Auto-checkout ready
- Location constraints enforced
- All APIs communicating properly

READY FOR PRODUCTION USE ✨
```

---

## 📞 NEED HELP?

If tests fail, check:
1. **Metro Console** for error messages (red text)
2. **Backend Logs**: `firebase functions:log -n 100`
3. **Network**: Ensure backend is reachable
4. **Permissions**: Check location permission in settings
5. **Database**: Verify dummy users exist: `firebase firestore:read profiles`

---

**Last Updated**: February 28, 2026  
**All Fixes**: ✅ Complete and ready for testing
