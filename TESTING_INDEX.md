# 📱 Testing Documentation Index

## Quick Navigation

**I want to...**

| Goal | Read This | Time |
|------|-----------|------|
| Get started NOW | [`TESTING_QUICK_START.md`](TESTING_QUICK_START.md) | 5 min |
| Copy-paste commands | [`QUICK_TEST.md`](QUICK_TEST.md) | 2 min |
| Detailed scenarios | [`TESTING_GUIDE.md`](TESTING_GUIDE.md) | 15 min |
| Run setup script | `./SETUP_TESTING.sh` | 1 min |

---

## 📚 What's Available

### 1. **TESTING_QUICK_START.md** ⭐ START HERE
**Best for:** First-time setup and overview
- 3 different testing options with pros/cons
- Step-by-step setup (5 minutes)
- Common troubleshooting
- When to use each option

### 2. **TESTING_GUIDE.md** (Comprehensive)
**Best for:** Deep dive into all features
- 6 detailed testing scenarios
- Multi-emulator setup
- Test data reference
- Cleanup instructions
- Advanced troubleshooting

### 3. **QUICK_TEST.md** (Cheat Sheet)
**Best for:** Fast command reference
- One-liners for common tasks
- Test phone numbers
- Checklist of scenarios
- Emergency commands

### 4. **SETUP_TESTING.sh** (Auto-setup)
**Best for:** Hands-off installation
- Runs prerequisites check
- Creates required files
- Provides next steps
```bash
./SETUP_TESTING.sh
```

---

## 🎯 The Three Testing Options

### Option 1: Emulator + Physical Device ⭐ RECOMMENDED
```bash
# Your phone
Login: 9029581874
→ Your account

# Emulator
Login: 8001001001
→ Priya Singh (demo user)

# Test: Chat, requests, check-in across both!
```
**Best because:** Realistic, tests real networking, portable

### Option 2: Multiple Emulators
```bash
# Emulator 1
emulator -avd Emulator1 &

# Emulator 2
emulator -avd Emulator2 &

# Run app on both, test everything locally
```
**Best because:** No physical devices needed, full control

### Option 3: Firebase Console
```bash
# Browse Firestore data directly
firebase firestore:get profiles

# Modify users without running app
firebase firestore:set profiles/dummy-user-1 --data "..."
```
**Best because:** Fastest data verification, no app needed

---

## 🚀 Quick Start (2 minutes)

```bash
# 1. Create demo users
cd firebase-backend
npm run seed

# 2. Add test phone numbers in Firebase Console
# https://console.firebase.google.com
# Authentication → Sign-in method → Phone
# → Add +918001001001 through +918001001010 with OTP "123456"

# 3. Test on app
# Device 1: Login as 9029581874
# Device 2: Login as 8001001001
# OTP: 123456 for both
```

---

## 📊 Demo Users (10 Available)

```
+918001001001 - Priya Singh (Travel, Books)
+918001001002 - Raj Patel (Fitness, Sports)
+918001001003 - Anjali Sharma (Art, Music)
+918001001004 - Vikram Desai (Business, Tech)
+918001001005 - Neha Gupta (Wellness, Nature)
+918001001006 - Arjun Kumar (Movies, Games)
+918001001007 - Pooja Reddy (Food, Travel)
+918001001008 - Rohit Singh (Music, Tech)
+918001001009 - Divya Nair (Fitness, Business)
+918001001010 - Aman Verma (Business, Finance)

Default OTP: 123456
Location: McDonald's - Hijewadi, Pune (all pre-checked-in)
```

---

## ✅ What You Can Test

- [x] **User Discovery** - Find other users in People list
- [x] **Friend Requests** - Send/Accept/Reject requests
- [x] **Chat** - Send messages between users
- [x] **Check-in** - See who's checked in at same location
- [x] **Profile Updates** - Edit and sync profile data
- [x] **Location-based Discovery** - Find users at same place
- [x] **Real-time Sync** - Updates across devices instantly

---

## 🐛 Common Issues & Fixes

| Problem | Quick Fix |
|---------|-----------|
| OTP not working | Add test number to Firebase Console |
| Users not appearing | Run `npm run seed` in firebase-backend |
| Chat not syncing | Verify both users are friends, wait 5 sec |
| Emulator won't start | Run `emulator -avd (emulator_name) &` in background |
| App crashes on login | Check internet connection, restart app |
| Can't find APK | Run `npx react-native run-android` |

---

## 🎮 My Testing Environment Setup

**Recommended Configuration:**
- Terminal 1: `emulator -avd Pixel_5_API_30 &` (Emulator with demo user)
- Terminal 2: `npm start` (Dev server/Metro)
- Terminal 3: `npx react-native run-android` (Build & install)
- Terminal 4: `adb logcat | grep ReactNativeJS` (Watch logs)
- Physical Device: Your developer phone (main user account)

**This gives you:**
- ✅ One emulator with demo user (Priya Singh)
- ✅ One physical device with your account
- ✅ Real-time logs to debug
- ✅ Full multi-user testing capability

---

## 📁 Firebase Backend Commands

```bash
# Create demo users
cd firebase-backend
npm run seed

# View all profiles
firebase firestore:get profiles

# Delete all test data
firebase firestore:delete profiles --recursive
firebase firestore:delete chatrooms --recursive

# Re-create everything
firebase firestore:delete profiles --recursive && npm run seed
```

---

## 📱 Android Emulator Commands

```bash
# List emulators
emulator -list-avds

# Start emulator (run in background with &)
emulator -avd Pixel_5_API_30 &

# View connected devices
adb devices

# Watch build logs
adb logcat

# Watch app logs
adb logcat | grep ReactNativeJS

# Uninstall app
adb uninstall com.klatchup.app

# Clear app data
adb shell pm clear com.klatchup.app

# Push file to device
adb push local_file.txt /data/local/tmp/

# Pull file from device
adb pull /data/local/tmp/file.txt local_file.txt
```

---

## 🎓 Learning Path

**First Time?**
1. Read: `TESTING_QUICK_START.md` (5 min)
2. Run: `npm run seed` in firebase-backend (2 min)
3. Add test numbers to Firebase Console (3 min)
4. Try: Option 1 (Emulator + Device) (10 min)
5. Success! 🎉

**Want Comprehensive Testing?**
1. Read: `TESTING_GUIDE.md` (15 min)
2. Complete all 6 scenarios (30 min)
3. File bugs/improvements

**Just Need Commands?**
1. Open: `QUICK_TEST.md`
2. Copy, paste, run!

---

## 🔧 Maintenance

**Before Each Testing Session:**
```bash
# Optional: Clear old data
cd firebase-backend
firebase firestore:delete profiles --recursive
firebase firestore:delete chatrooms --recursive

# Recreate fresh demo users
npm run seed

# Restart app on both devices
```

---

## 📞 Help

**Lost at any point?**
1. Check `QUICK_TEST.md` for commands
2. Read `TESTING_QUICK_START.md` for options
3. Browse `TESTING_GUIDE.md` for detailed scenarios

**Getting errors?**
1. Search error in troubleshooting section
2. Check Firebase Console for data
3. View logs with `adb logcat | grep ReactNativeJS`

---

## 🎯 Success Criteria

You're done when you can:
- ✅ Login with 2 different phone numbers
- ✅ Send friend request from one user to another
- ✅ Accept request on second user
- ✅ Chat between both users in real-time
- ✅ Check in to location from both users
- ✅ See both users in location's checked-in list

---

**Now go test! 🚀**

Start with: [`TESTING_QUICK_START.md`](TESTING_QUICK_START.md)
