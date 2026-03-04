# Klatchup Application - UI Reference Guide

## Screen Mapping (Figma → Code)

### 1. **Authentication Screens**
- **Splash Screen** → `src/views/splash/`
  - File: `Splash_screen.png`, `Splash_screen2.jpg`
  - Status: ✅ Implemented
  
- **Login Screen** → `src/views/authentication/`
  - Files: `Login_screen.jpg`, `Login_error_screen.jpg`
  - Components: Phone input, OTP button
  - Status: ✅ Implemented
  
- **OTP Verification** → `src/views/authentication/`
  - Files: `OTP_Verification.jpg`, `OTP_Verification-1.jpg`, `OTP_Verification-2.jpg`
  - Components: OTP input, verify button
  - Status: ✅ Implemented

### 2. **Onboarding Screens**
- **Onboarding Step 1-3** → `src/views/onboarding/`
  - Files: `Onboarding_screen.jpg`, `Onboarding_screen-1.jpg`, `Onboarding_screen-2.jpg`
  - Components: Welcome screens, next button
  - Status: ✅ Implemented

### 3. **Profile Setup Screens**
- **Profile Image Edit** → `src/views/profile/`
  - Files: `Image_edit.jpg`, `Image_edit-1.jpg`, `Image_edit-2.jpg`
  - Components: Image picker, camera, gallery
  - Status: ✅ Implemented

- **Interest Selection** → `src/views/profile/`
  - Files: `Interest_screen.jpg`, `Interest_screen 2.jpg`, `Interest_screen3.jpg`
  - Components: Interest chips, multi-select
  - Status: ✅ Implemented

- **Profile Details** → `src/views/profile/`
  - Files: `Profile_1.jpg`, `Profile_2.jpg`, `Profile_3_1.jpg`, `Profile_4.jpg`
  - Components: Form fields, bio input, work/education
  - Status: ✅ Implemented

### 4. **Home Screen**
- **Home Page** → `src/views/home/`
  - Files: `Home_screen.png`, `Home_screen-1.png`
  - Components: Location header, mini cards, navigation tabs
  - Status: ✅ Implemented

### 5. **Finding/Discovery Screens**
- **Finding Location/Society Screen** → `src/views/findingSociety/`
  - Files: `Finding_screen.jpg`, `Finding_screen-1.jpg` through `Finding_screen-6.jpg`
  - Files: `Finding_list_screen.jpg`
  - Components: Location cards, list view, filters
  - Status: ✅ Implemented

- **Society/People List (Empty)** → `src/views/societyUsers/`
  - File: `profile_list_View_empty_screen.jpg`
  - Components: Empty state, refresh button
  - Status: ⚠️ Needs empty state UI

- **Society/People List View** → `src/views/societyUsers/`
  - Files: `KoregaonPark_list_View_screen.jpg`, `KoregaonPark_list_View_empty_screen.jpg`
  - Components: User cards with "🎯 Klatchup" button, interest tags
  - Status: ✅ Implemented (needs refinement)

### 6. **Klatchup Requests Screen**
- **Klatchup Requests List** → `src/views/klatchupRequests/`
  - Files: `Klatch-up_list.png`, `Klatch-up_list-1.png` through `Klatch-up_list-8.png`
  - Components: Request cards, Accept/Ignore buttons (Red/Green)
  - Status: ✅ Implemented

- **Request List (Empty)** → `src/views/klatchupRequests/`
  - File: `Request_list_empty.png`
  - Components: Empty state message
  - Status: ⚠️ Needs empty state UI

### 7. **Chat Screens**
- **Chat Screen** → `src/views/chat/ChatMessages.tsx`
  - Files: `Chat.png`, `Chat-1.png`, `Chat_screen.png`, `Chat_screen-1.png`
  - Components: Message bubbles, input field, send button
  - Status: ✅ Implemented

- **Chat User Details** → `src/views/chat/`
  - Files: `Chat_User-details.png`, `Chat_User-details-1.png`, `Chat_User-details-2.png`
  - Components: Profile card, call/video icons
  - Status: ⚠️ Partial implementation

### 8. **Profile Screens**
- **Profile Details View** → `src/views/profile/`
  - Files: `Profile_details.png`, `Profile_details-1.png` through `Profile_details-4.png`
  - Components: User info, edit button, images gallery
  - Status: ⚠️ Needs work

### 9. **Notification Screen**
- **Notifications** → `src/views/notifications/`
  - Files: `Notification.png`, `Notification-1.png`
  - Components: Notification list items
  - Status: ⏳ Not started

---

## Current UI Component Status

### ✅ COMPLETE
- Login & Authentication flow
- OTP Verification
- Onboarding flow
- Profile setup (images, interests, details)
- Home screen
- Finding/Location screen
- Society Users list with Klatchup button
- Klatchup Requests with Accept/Ignore buttons
- Chat messaging screen

### ⚠️ NEEDS REFINEMENT
- Empty state screens (should show when no data)
- Chat user details panel
- Profile view/details screen
- Button styling consistency (some already updated with emojis)

### ⏳ TODO
- Notification center
- Notification list styling

---

## Design System (From Figma)

### Colors
```typescript
PRIMARY: '#300943'    // Dark purple (backgrounds)
SUCCESS: '#00D084'    // Green (Klatchup button, accept)
DANGER: '#FF6B6B'     // Red (Ignore button)
WHITE: '#FFFFFF'      // Text, cards
GRAY: '#555555'       // Secondary text
DARK: '#1a0a2e'       // Dark backgrounds
```

### Typography
- **Font Family**: Prompt (Regular, Bold, Semi-Bold)
- **Heading**: 18-20px, Bold
- **Body**: 14px, Regular
- **Small**: 12px, Regular

### Button Styles
- **Primary Button**: Green (#00D084), rounded 20px
- **Danger Button**: Red (#FF6B6B), rounded 20px
- **Secondary**: Gray background

### Card Layout
- Rounded corners: 20px
- Border: Gradient (light purple)
- Padding: 16px
- Shadow: Light drop shadow

---

## Current Implementation Status

### Code Components vs Figma

**Currently Implemented:**
- ✅ UsersListItem → Shows user card with "🎯 Klatchup" button
- ✅ RequestsListItem → Shows request card with Red (Ignore) & Green (Accept) buttons
- ✅ ChatMessages → Shows message bubbles
- ✅ Profile screens → Basic profile setup

**Needs Update:**
- Empty states for no data
- Loading states
- Error states
- Notification panel

---

## Quick Reference: Button Styles from Figma

### "🎯 Klatchup" Button
- Color: Green (#00D084)
- Shape: Rounded, bottom-left radius
- Text: "🎯 Klatchup" (with emoji)
- State: Shows spinner when loading

### "Ignore" Button  
- Color: Red (#FF6B6B)
- Shape: Rounded, bottom-left radius
- Text: "👋 Ignore"
- State: Triggers alert on tap

### "Accept" Button
- Color: Green (#00D084)
- Shape: Rounded, bottom-right radius
- Text: "✓ Klatchup" or "Accept"
- State: Loading spinner + success alert

---

## Next Steps

1. **Empty States**: Create empty state screens with messaging
2. **Profile Details**: Complete the profile view/edit screens
3. **Notifications**: Build notification center
4. **Consistency Check**: Verify all screens match Figma colors/spacing
5. **Loading States**: Add skeleton loaders during data fetch
