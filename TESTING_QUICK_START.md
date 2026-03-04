# 🎯 Klatchup Multi-User Testing - Complete Guide

## Overview

You have **one developer phone** but need to test **multi-user features** (chat, friend requests, check-ins, etc.). This guide shows you **3 ways** to test:

1. **Emulator + Device** (Recommended) - Modern & Easy
2. **Multiple Emulators** - Full Testing Without Devices
3. **Firebase Console** - Direct Database Updates

---

## 📋 What You'll Need

- ✅ Your developer phone (already tested)
- ✅ Android Emulator or second device (optional)
- ✅ Firebase project access
- ✅ 10 demo user profiles (we'll create these)

---

## 🚀 Setup (Do This First - 5 minutes)

### Step 1: Create Demo User Profiles

```bash
cd /Users/pavan/Documents/klatchup/klatchup/firebase-backend
npm install
npm run seed
```

**Output should show:**
```
🚀 Starting to create 10 dummy users...
✅ Created: Priya Singh (dummy-user-1)
✅ Created: Raj Patel (dummy-user-2)
... (8 more users)
🎉 Successfully created 10 dummy users!
📍 Location: McDonald's - Hijewadi Happiness Street (Pune)
```

### Step 2: Add Test Phone Numbers to Firebase

1. Open: **https://console.firebase.google.com**
2. Select your Klatchup project
3. Go: **Authentication** → **Sign-in method** → **Phone**
4. Scroll down to: **"Phone numbers for testing"**
5. **Add these 10 numbers** with OTP code `123456`:

```
+918001001001 → Priya Singh
+918001001002 → Raj Patel
+918001001003 → Anjali Sharma
+918001001004 → Vikram Desai
+918001001005 → Neha Gupta
+918001001006 → Arjun Kumar
+918001001007 → Pooja Reddy
+918001001008 → Rohit Singh
+918001001009 → Divya Nair
+918001001010 → Aman Verma
```

**✅ Setup Complete!**

---

## 🎮 Option 1: Emulator + Physical Device (Recommended)

### Best For: Testing real-world scenarios with chat, location sharing, etc.

#### Prerequisites
- Android Emulator already available OR download from Android Studio
- Your developer phone

#### Setup (10 minutes)

**Terminal 1: Start Emulator**
```bash
# List available emulators
emulator -list-avds

# If no emulator, create one using Android Studio
# Or start existing emulator:
emulator -avd Pixel_5_API_30 &

# Wait 30 seconds for emulator to boot
```

**Terminal 2: Start Metro Dev Server**
```bash
cd /Users/pavan/Documents/klatchup/klatchup
npm start
```

**Terminal 3: Build & Install on Emulator**
```bash
cd /Users/pavan/Documents/klatchup/klatchup
npx react-native run-android
# When prompted, select the emulator
```

**Terminal 4: Watch Logs**
```bash
adb logcat | grep ReactNativeJS
```

#### Testing Flow

**On Your Physical Device:**
```
1. Open Klatchup app
2. Enter phone: 9029581874
3. Request OTP → Enter: 123456
4. Log in successfully
5. Go to "People" section
6. Should see 10 demo users listed
```

**On Emulator:**
```
1. Open Klatchup app
2. Enter phone: 8001001001 (Priya Singh)
3. Request OTP → Enter: 123456
4. Create/complete profile
5. Navigate to "Chat" or "KlatchUp Requests"
```

**Test Scenarios:**
- Your Device: Send friend request to Priya Singh
- Emulator: Accept request in "KlatchUp Requests"
- Your Device: Start chat with Priya
- Emulator: Reply to message
- Both: Check-in to same location, verify visibility

---

## 🎮 Option 2: Multiple Emulators (No Physical Device Needed)

### Best For: Full testing without needing physical devices

#### Setup (15 minutes)

**Terminal 1: Start First Emulator**
```bash
emulator -avd Emulator1 &
# Wait 30 seconds
```

**Terminal 2: Start Second Emulator**
```bash
emulator -avd Emulator2 &
# Wait 30 seconds
```

**Terminal 3: Verify Both Emulators**
```bash
adb devices
# Should show:
# emulator-5554    device
# emulator-5556    device
```

**Terminal 4: Start Dev Server**
```bash
cd /Users/pavan/Documents/klatchup/klatchup
npm start
```

**Terminal 5: Build & Install on First Emulator**
```bash
# Build APK
cd /Users/pavan/Documents/klatchup/klatchup
npx react-native run-android --variant debug

# When prompted, select emulator-5554
```

**Terminal 6: Install on Second Emulator**
```bash
adb -s emulator-5556 install android/app/build/outputs/apk/debug/app-debug.apk

# Open app on emulator-5556 manually
```

#### Testing Flow

**Emulator 1:**
```
Phone: 9029581874
OTP: 123456
→ Your main account
```

**Emulator 2:**
```
Phone: 8001001001 (Priya Singh)
OTP: 123456
→ First demo user
```

**Test Scenarios (Same as Option 1)**

---

## 🔍 Option 3: Using Firebase Console Only (Quickest)

### Best For: Testing data structures and backend without running app

#### Verify Demo Users Created
```bash
firebase firestore:get profiles
# Should show 10 users in JSON format
```

#### Modify User Data Directly
```bash
# Update a user's location
firebase firestore:set profiles/dummy-user-1 --data "currentLocation.lat=18.5888719"

# Delete a user
firebase firestore:delete profiles/dummy-user-1
```

---

## 📝 Testing Scenarios Checklist

### Scenario 1: User Discovery ✓
- [ ] Login as User A (your main phone)
- [ ] Login as User B (emulator or 2nd phone)  
- [ ] User A goes to "People" section
- [ ] User B visible in list
- [ ] Can tap profile to see full details

### Scenario 2: Friend Requests ✓
- [ ] User A sends friend request to User B
- [ ] User B sees request in "KlatchUp Requests"
- [ ] User B can "Accept" or "Ignore"
- [ ] After accept, both see each other in "Friends"

### Scenario 3: Chat ✓
- [ ] User A & B are friends
- [ ] User A opens chat, types message
- [ ] User B receives message in real-time
- [ ] User B replies
- [ ] User A sees reply
- [ ] Chat history persists after reload

### Scenario 4: Check-in ✓
- [ ] User A checks into "McDonald's"
- [ ] User B goes to same location
- [ ] User A visible in checked-in list
- [ ] Can see "2 people checked in"

### Scenario 5: Profile Updates ✓
- [ ] User A edits profile (bio, interests)
- [ ] User B views User A's profile
- [ ] Changes reflected immediately
- [ ] Persists after app reload

### Scenario 6: Location-Based Discovery ✓
- [ ] User A checks in at Location X
- [ ] User B checks in at Location X
- [ ] Both see each other in that location
- [ ] Move to Location Y, lists update

---

## 🐛 Troubleshooting

### "OTP Failed" / "Invalid Phone Number"
**Solution:**
1. Verify test number entered exactly: `+918001001001` (with +91)
2. Open Firebase Console → Authentication → Sign-in method → Phone
3. Scroll to "Phone numbers for testing"
4. Confirm all 10 numbers are listed
5. Restart the app

### "User Not Found" in People List
**Solution:**
```bash
# Verify seed ran successfully:
cd firebase-backend
npm run seed  # Re-run if needed

# Check Firestore data:
firebase firestore:get profiles

# Should show 10 profiles starting with dummy-user-1
```

### Chat Messages Not Syncing
**Solution:**
1. Verify both users are friends (friend request accepted)
2. Wait 3-5 seconds for real-time sync from Firestore
3. Close app on both devices
4. Restart app and try again
5. Check Firestore rules allow authenticated `read/write`

### Emulator Very Slow
**Solution:**
```bash
# Start with more resources:
emulator -avd Emulator1 -ram 4096 -cores 4 &
```

### Can't Find Emulator APK to Install
**Solution:**
```bash
# Build APK explicitly:
cd android && ./gradlew assembleDebug && cd ..

# Then install:
adb -s emulator-5556 install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🗂️ Quick Command Reference

```bash
# 📱 Create Demo Users
cd firebase-backend && npm run seed

# 🚀 Start Emulator
emulator -avd Pixel_5_API_30 &

# 💻 Start Dev Server
npm start

# 🔨 Build & Install
npx react-native run-android

# 📊 Check Firebase Data
firebase firestore:get profiles

# 🗑️ Clear Test Data
firebase firestore:delete profiles --recursive

# 📋 View Logs
adb logcat | grep ReactNativeJS

# 📱 View All Devices
adb devices

# 🔌 Check Device Connection
adb devices -l
```

---

## 📊 Test Users Reference

| Phone | Name | Interests | Best For |
|-------|------|-----------|----------|
| 8001001001 | Priya Singh | Travel, Books | First chat test |
| 8001001002 | Raj Patel | Fitness, Sports | Friend request |
| 8001001003 | Anjali Sharma | Art, Music | Profile view |
| 8001001004 | Vikram Desai | Business, Tech | Professional demo |
| 8001001005 | Neha Gupta | Wellness, Nature | Check-in test |
| 8001001006 | Arjun Kumar | Movies, Games | Interest matching |
| 8001001007 | Pooja Reddy | Food, Travel | Multiple interests |
| 8001001008 | Rohit Singh | Music, Tech | Similar interests |
| 8001001009 | Divya Nair | Fitness, Business | Professional network |
| 8001001010 | Aman Verma | Business, Finance | Mentor role |

---

## 🎓 Best Practices

1. **Always** test with emulator + device combo first
2. **Log in as different users** for realistic scenarios
3. **Test at same location** to verify check-in features
4. **Clear data** between tests: `firebase firestore:delete profiles --recursive`
5. **Check device battery** - testing uses lots of power
6. **Use 4G/WiFi** - both devices on same network for real-time sync
7. **Keep Firebase Console open** - verify data in real-time

---

## 📚 Next Steps

1. ✅ Run seed script
2. ✅ Add test phone numbers to Firebase
3. ✅ Choose testing option (1, 2, or 3)
4. ✅ Follow testing flow
5. ✅ Check off scenarios as you complete them
6. ✅ File bugs or improvements

---

## 📞 Quick Help

**Can't decide which option?**
- Have 1 device? → **Option 1: Emulator + Device** ✓
- Have no devices? → **Option 2: Multiple Emulators** ✓
- Don't want to run app? → **Option 3: Firebase Console** ✓

**Need more help?**
- See detailed scenarios: `TESTING_GUIDE.md`
- Quick commands: `QUICK_TEST.md`
- Setup script: `./SETUP_TESTING.sh`

---

**Happy Testing! 🎉**
