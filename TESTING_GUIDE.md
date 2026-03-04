# Klatchup Multi-User Testing Guide

## Overview
This guide helps you test the Klatchup app with multiple users without needing multiple physical devices.

---

## Part 1: Setting Up Demo Users

### Option A: Run Seed Script (Recommended)

#### Step 1: Navigate to Firebase Backend
```bash
cd firebase-backend
npm install
```

#### Step 2: Set Up Firebase Authentication
You need Firebase Authentication configured to accept test phone numbers. Add these to your Firebase Console:

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Phone" if not already enabled
3. Add test phone numbers in the Phone testing numbers section:
   - `+918001001001` (Priya Singh)
   - `+918001001002` (Raj Patel)
   - `+918001001003` (Anjali Sharma)
   - `+918001001004` (Vikram Desai)
   - `+918001001005` (Neha Gupta)
   - `+918001001006` (Arjun Kumar)
   - `+918001001007` (Pooja Reddy)
   - `+918001001008` (Rohit Singh)
   - `+918001001009` (Divya Nair)
   - `+918001001010` (Aman Verma)

For each test number, set code: `123456` (default test code)

#### Step 3: Run Seed Script
```bash
# From firebase-backend directory
npx ts-node src/seed-users.ts
```

This will create 10 dummy user profiles in Firestore with:
- Different names, interests, and locations
- All checked in at McDonald's - Hijewadi, Pune
- Empty friend lists (ready for connections)

---

## Part 2: Testing Multi-User Scenarios

### Scenario 1: Testing User Discovery & Friend Requests

**Setup:**
- Device/Emulator 1: Log in as `9029581874` (Pavan - Your main account)
- Device/Emulator 2: Log in as `8001001001` (Priya Singh)

**Test Steps:**
1. **On Device 1 (Your Account):**
   - Go to "People" or "Find Society" section
   - Should see Priya Singh in the list
   - Tap "Send Request"
   - ✓ Verify: Priya appears under "Sent Requests"

2. **On Device 2 (Priya's Account):**
   - Go to "KlatchUp Requests" section
   - Should see your profile with "Accept" and "Ignore" buttons
   - Tap "Accept"
   - ✓ Verify: Your profile moves to "Friends" list, chat option appears

### Scenario 2: Testing Chat Functionality

**Prerequisites:**
- Both users should be friends (completed Scenario 1 first)

**Test Steps:**
1. **On Device 1:**
   - Go to "Chat" section
   - Should see Priya Singh in chat list
   - Tap and open chat
   - Send message: "Hi Priya! 👋"
   - ✓ Verify: Message appears in chat history

2. **On Device 2:**
   - Go to "Chat" section
   - Should see your message from Device 1
   - Reply: "Hello! Nice to meet you! 😊"

3. **Back on Device 1:**
   - Refresh chat
   - ✓ Verify: Priya's reply appears

### Scenario 3: Testing Check-In System

**Test Steps:**
1. **On Device 1:**
   - Go to "Find Society" section
   - Should see location-based places
   - Select a place (e.g., McDonald's)
   - Tap "Check In"
   - ✓ Verify: Shows "Checked In" status
   - ✓ Verify: Current location updated in profile

2. **On Device 2:**
   - Go to "Find Society"
   - Navigate to same place (McDonald's)
   - ✓ Verify: You see Device 1's user in the checked-in list
   - Tap on their profile to see full details

### Scenario 4: Testing Friend Request Rejection

**Setup:**
- Device 2: Still logged in as Priya Singh

**Test Steps:**
1. **On Device 1:**
   - Go to "People"
   - Find "Raj Patel" (another demo user)
   - Tap "Send Request"

2. **On Device 2:**
   - Logout (go to Settings)
   - Simulate login as Raj Patel using `8001001002`
   - OTP: `123456`
   - Go to "KlatchUp Requests"
   - Tap "Ignore" on your profile
   - ✓ Verify: Request disappears

3. **Back on Device 1:**
   - Refresh "People"
   - ✓ Verify: Raj Patel shows "Requested" status (not "Send Request")

### Scenario 5: Testing Profile Updates & Sync

**Setup:**
- Both devices logged in with different users

**Test Steps:**
1. **On Device 1:**
   - Go to "My Profile"
   - Update bio: "Updated bio at " + (current time)
   - Change interests
   - Tap "Continue"
   - ✓ Verify: Shows success message

2. **On Device 2:**
   - Go to "People"
   - Find Device 1's user
   - Tap to view profile
   - ✓ Verify: Updated bio and interests appear immediately

### Scenario 6: Testing Multiple Locations

**Test Steps:**
1. **On Device 1:**
   - Go to "Find Society"
   - Check in at a different location
   - ✓ Verify: Can switch between locations
   - ✓ Verify: Your location updates in other users' views

---

## Part 3: Using Android Emulators for Testing

### Setup Multiple Emulators

```bash
# List available emulators
emulator -list-avds

# Create new emulator if needed
emulator -avd Emulator1 -netdelay none -netspeed full &
emulator -avd Emulator2 -netdelay none -netspeed full &

# Wait ~30 seconds for emulators to boot, then:
adb devices  # Should show both emulators
```

### Install App on Both Emulators

```bash
# Terminal 1 - Build once
cd /Users/pavan/Documents/klatchup/klatchup
npx react-native run-android

# Terminal 2 - Install on specific emulator
adb -s emulator-5556 install android/app/build/outputs/apk/debug/app-debug.apk

# Terminal 3 - Install on other emulator
adb -s emulator-5558 install android/app/build/outputs/apk/debug/app-debug.apk
```

### Switch Between Emulators in Logs

```bash
# Watch logs from emulator 1
adb -s emulator-5556 logcat | grep ReactNativeJS

# Watch logs from emulator 2
adb -s emulator-5558 logcat | grep ReactNativeJS
```

---

## Part 4: Test Data Reference

### Demo Users Credentials

| # | Name | Phone | Interests | Role |
|---|------|-------|-----------|------|
| 1 | Priya Singh | 8001001001 | Travel, Books | Early Friend |
| 2 | Raj Patel | 8001001002 | Fitness, Sports | Requester Demo |
| 3 | Anjali Sharma | 8001001003 | Art, Music | Chat Test |
| 4 | Vikram Desai | 8001001004 | Business, Tech | Rejection Demo |
| 5 | Neha Gupta | 8001001005 | Wellness, Nature | Friends List |
| 6 | Arjun Kumar | 8001001006 | Movies, Games | Chat Test |
| 7 | Pooja Reddy | 8001001007 | Food, Travel | Location Demo |
| 8 | Rohit Singh | 8001001008 | Music, Tech | Profile Update |
| 9 | Divya Nair | 8001001009 | Fitness, Business | Check-in Demo |
| 10 | Aman Verma | 8001001010 | Business, Finance | Mentor Role |

**Default Test OTP:** `123456` (for all test numbers)

---

## Part 5: Troubleshooting

### Issue: OTP Not Sending to Test Numbers
**Solution:**
1. Verify test numbers are added in Firebase Console → Authentication → Phone
2. Make sure you're using exact format: `+918001001001`
3. Restart the app after adding test numbers

### Issue: Users Not Appearing in People List
**Solution:**
1. Verify seed script ran successfully
2. Check Firestore database to confirm `profiles` collection exists
3. Verify both users are checked in at same location (McDonald's Hijewadi)
4. Force refresh app (close and reopen)

### Issue: Chat Messages Not Syncing
**Solution:**
1. Check internet connection on both devices
2. Verify both users are friends (check-in step completed)
3. Check Firestore rules allow read/write for authenticated users
4. Try clearing app cache on device: Settings → Apps → Klatchup → Clear Cache

### Issue: Check-in Location Not Updating
**Solution:**
1. Grant location permissions when prompted
2. Check device location services are enabled
3. Verify Firestore `profiles` document has `currentLocation` field
4. Wait 5-10 seconds for location update to sync

---

## Part 6: Quick Test Checklist

- [ ] Seed script ran successfully (10 users created)
- [ ] Can login with multiple phone numbers
- [ ] Can see other users in "People" section
- [ ] Can send friend requests
- [ ] Can accept/reject requests
- [ ] Can chat with friends
- [ ] Can check in to locations
- [ ] Can see checked-in users from other device
- [ ] Profile updates sync across devices
- [ ] Can see friend status changes in real-time

---

## Part 7: Adding More Demo Users

To add more demo users, edit `firebase-backend/src/seed-users.ts`:

```typescript
const dummyUsers = [
  {
    name: 'Your User Name',
    mobile: '+918001001011',  // New unique number
    birthDate: '1990-01-01',
    gender: 'Male/Female',
    city: 'Pune',
    bio: 'Your bio here',
    work: 'Your job',
    education: 'Your education',
    lookingFor: 'Friends',
    interests: [
      { name: 'Interest1', subInterest: 'SubInterest1' },
      { name: 'Interest2', subInterest: 'SubInterest2' }
    ]
  },
  // ... more users
];
```

Then re-run:
```bash
npx ts-node src/seed-users.ts
```

---

## Part 8: Cleanup

To reset test data:

```bash
# Clear all profiles
firebase firestore:delete profiles --recursive

# Clear all chat rooms
firebase firestore:delete chatrooms --recursive

# Re-run seed script
npx ts-node src/seed-users.ts
```

---

**Happy Testing! 🎉**
