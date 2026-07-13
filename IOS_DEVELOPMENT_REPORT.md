# Klatchup iOS — Development Status Report

**Date:** 14 April 2026  
**React Native:** 0.76.3 | **iOS Target:** 15.1+ | **Firebase SDK:** 11.12.0

---

## 1. iOS Build Configuration Status

| Item | Status | Details |
|------|--------|---------|
| Xcode project | ✅ Ready | `klatchup.xcworkspace` with CocoaPods |
| CocoaPods | ✅ Installed | `Pods/Manifest.lock` present, all deps resolved |
| Firebase config | ✅ Present | `GoogleService-Info.plist` — project `klatchup-pavan2` |
| AppDelegate | ✅ Configured | `[FIRApp configure]` in `AppDelegate.mm` |
| Privacy manifest | ✅ Compliant | `PrivacyInfo.xcprivacy` for iOS 17+ |
| Info.plist permissions | ✅ Declared | Camera, Location (Always + WhenInUse), Photo Library |
| Xcode 16 compat | ✅ Handled | `klatchup.xcconfig` suppresses strict warnings |
| Static framework linkage | ✅ Correct | Resolves Firebase + RN 0.76 header conflicts |
| Bundle ID | ✅ Set | `com.klatchup.app` |
| Build artifacts | ✅ Exist | Archive + IPA in `ios/build/` |
| Bridging Header | ⚪ Empty | Acceptable — no Swift-ObjC interop needed currently |
| Firebase Analytics | ⚪ Disabled | Intentional — enable when ready for App Store |

**Verdict:** iOS native layer is properly configured and has been successfully built at least once.

---

## 2. App Architecture Overview

```
App.tsx (ErrorBoundary → Redux Provider → Navigation)
    │
    ├── Navigation (24 screens, React Navigation native-stack)
    │     ├── Onboarding: Splash → Intro → Login → MobileNo → OTP → CreateProfile
    │     ├── Main: Home → FindingSociety → SocietyUsers → KlatchupRequests
    │     ├── Chat: Chat → ChatMessages → LocationChat → LocationChatMessages
    │     └── Profile/Settings: MyProfile → UserProfile → Settings + sub-screens
    │
    ├── State: Redux Toolkit + Redux-Saga
    │     ├── slices: profile (auth/friends/profile CRUD), sample (location/nearby)
    │     └── sagas: profileSaga (auth/profile), locationSaga (places/checkin)
    │
    └── Services: api.ts, chatService, checkinService, locationTracking,
                  pushNotification, liveNotification, storageService
```

**Backend:** Firebase Cloud Functions at `us-central1-klatchup2-app.cloudfunctions.net/api`

---

## 3. Feature Completeness Matrix

### Core Features

| Feature | Screen | Status | Notes |
|---------|--------|--------|-------|
| Splash / Session Restore | splash | ✅ Complete | Auto-login from AsyncStorage |
| Phone Auth (OTP) | onbording | ✅ Complete | Firebase Auth, heavy console logging |
| Profile Creation | createProfile | ✅ Complete | 4-step wizard with progress bar |
| Profile Edit | myprofile | ⚠️ 90% | `updatedAt` set to `true` instead of timestamp |
| Home Screen | home | ✅ Complete | Greeting + check-in card |
| Location Discovery | findingSociety | ✅ Complete | GPS + nearby places search |
| Check-In / Check-Out | societyUsers | ✅ Complete | Auto-checkout >1km via backend |
| Users at Location | societyUsers | ✅ Complete | List with age/interests |
| KlatchUp Requests | klatchupRequests | ✅ Complete | Accept/ignore friend requests |
| User Profile View | userprofile | ✅ Complete | Carousel, swipe limits, report |
| 1:1 Chat | chat | ✅ Complete | Message thread with read receipts |
| Location Group Chat | chat/LocationChat | ✅ Complete | Place-based conversation |
| Notifications | notifications | ✅ Complete | Live polling with mark-as-read |
| Push Notifications | PushNotificationBootstrap | ✅ Complete | FCM token registration |
| Image Upload | storageService | ✅ Complete | Base64 → Firebase Storage |
| Background Location | locationTrackingService | ✅ Complete | 30s interval + auto-checkout |
| Settings | settings | ⚠️ 60% | Logout works; feedback/report/notifications stubs |

### Missing / Incomplete Features

| Feature | Current State | Work Needed |
|---------|--------------|-------------|
| Send Feedback | Alert mock only | Connect to API endpoint |
| Report Problem | Dead link | Build screen + API |
| Notification Sound toggle | Dead link | Implement preference storage |
| Realtime Listeners | Stubbed (empty functions) | Replace polling with Firebase RTDB listeners |
| Onboarding `main.tsx` | Empty stub ("HI Main") | Remove or implement |
| Home notification tap | Empty handler | Navigate to Notifications screen |
| KlatchUp request item tap | Console.log only | Navigate to UserProfile |

---

## 4. Code Quality Issues

### TypeScript Error (Active)

**File:** `App.tsx:30`  
**Error:** `Argument of type 'string[]' is not assignable to parameter of type 'Permission[]'`  
**Fix:** Type the array as `Permission[]` instead of `string[]`:
```typescript
const permissions: (typeof PermissionsAndroid.PERMISSIONS)[keyof typeof PermissionsAndroid.PERMISSIONS][] = [...]
```

### Commented / Dead Code

| File | Line(s) | Description |
|------|---------|-------------|
| `views/myprofile/index.tsx` | ~432 | Old InterestExpandableItem component |
| `views/societyUsers/index.tsx` | ~40–52 | Placeholder test data |
| `views/societyUsers/index.tsx` | ~299 | Disabled Loader component |
| `views/klatchupRequests/index.tsx` | ~11–23 | Placeholder test data |
| `views/onbording/verifyOtp.tsx` | scattered | 24+ console.log statements |

### Data Type Issue

| File | Problem | Fix |
|------|---------|-----|
| `views/myprofile/index.tsx` (~line 315) | `updatedAt: true` | Change to `updatedAt: new Date().toISOString()` |

---

## 5. iOS-Specific Development Items

### Ready to Build
The iOS project appears buildable. To verify:
```bash
cd ios && pod install
npx react-native run-ios --device
```

### iOS-Specific TODOs

| Priority | Task | Details |
|----------|------|---------|
| **P0** | Test on physical iPhone | Verify Firebase Auth OTP, location permissions, push notifications |
| **P0** | Verify push notifications | FCM token registration + foreground/background message handling |
| **P1** | App Store provisioning | Signing certs, provisioning profiles, App Store Connect setup |
| **P1** | Test background location | iOS has strict background location rules — verify `Always` works |
| **P2** | App icon & launch screen | Verify `Images.xcassets` has all required sizes (1024x1024 for store) |
| **P2** | Deep linking / Universal links | Not implemented — needed for notification taps from outside app |
| **P3** | iPad support | Info.plist allows landscape — decide if iPad is a target |

### iOS Permission Flow
Permissions declared in `Info.plist` are correct:
- `NSCameraUsageDescription` ✅
- `NSLocationAlwaysAndWhenInUseUsageDescription` ✅
- `NSLocationWhenInUseUsageDescription` ✅
- `NSPhotoLibraryUsageDescription` ✅
- `NSPhotoLibraryAddUsageDescription` ✅

**Note:** `App.tsx` only requests Android permissions (`PermissionsAndroid`). iOS permission prompts are handled automatically by the native frameworks on first use — this is correct.

---

## 6. Recommended Development Roadmap

### Phase 1 — Fix & Stabilize (Before iOS Testing)

1. Fix the TypeScript error in `App.tsx` (Permission type)
2. Fix `updatedAt: true` bug in MyProfile
3. Remove dead code and excessive console.logs
4. Wire up empty handlers (notification tap → navigate, request item tap → navigate)
5. Remove or hide `main.tsx` stub from onboarding

### Phase 2 — iOS Build & Test

6. Run `pod install` and verify clean Xcode build
7. Test full auth flow on physical iPhone (OTP → Profile → Home)
8. Test location permission flow (WhenInUse → Always upgrade)
9. Test push notifications (FCM foreground + background)
10. Test chat messaging between two devices
11. Verify image upload from iOS camera/gallery

### Phase 3 — Complete Missing Features

12. Implement feedback/report submission API
13. Implement notification sound preferences
14. Replace polling-based notifications with Firebase RTDB listeners
15. Add deep linking for push notification taps

### Phase 4 — App Store Preparation

16. Apple Developer account + provisioning
17. App Store screenshots and metadata
18. App Review guidelines compliance check
19. TestFlight beta distribution
20. Submit for App Store review

---

## 7. Dependencies Summary

| Category | Package | Version | iOS Compatible |
|----------|---------|---------|----------------|
| Core | react-native | 0.76.3 | ✅ |
| Firebase | @react-native-firebase/* | 22.2.0 | ✅ (pods v11.12.0) |
| Navigation | @react-navigation/native-stack | 6.9.14 | ✅ |
| State | @reduxjs/toolkit + redux-saga | 2.6.1 / 1.3.0 | ✅ |
| Location | react-native-geolocation-service | 5.3.1 | ✅ |
| Camera | react-native-image-crop-picker | 0.40.0 | ✅ |
| UI | react-native-linear-gradient | 2.8.3 | ✅ |
| UI | react-native-reanimated | 3.3.0 | ✅ |
| Storage | @react-native-async-storage | 2.1.2 | ✅ |

All dependencies have iOS native pod support and are installed (`Podfile.lock` confirms).

---

## 8. Quick Reference — Key Files

| Purpose | Path |
|---------|------|
| Entry point | `App.tsx` |
| Navigation | `src/navigation/Navigator.tsx` |
| API config | `src/services/apiConfig.ts` |
| All API calls | `src/services/api.ts` |
| Chat APIs | `src/services/chatService.ts` |
| Check-in logic | `src/services/checkinService.ts` |
| Redux store | `src/store/index.ts` |
| Profile state | `src/slices/profile.ts` |
| Location state | `src/slices/sample.ts` |
| Design tokens | `src/theme/DesignSystem.ts` |
| iOS config | `ios/Podfile`, `ios/klatchup/Info.plist` |
| Firebase iOS | `ios/klatchup/GoogleService-Info.plist` |
