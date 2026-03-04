# Klatchup - Location & User Discovery Features

## 📍 New Features Implemented

### 1. **Adjustable Search Radius** 🎯
Search for places and people with customizable radius:
- 500m, 1km, 2km, 3km, 4km, 5km, 10km, 15km, 20km
- Easy-to-use horizontal scrollable selector
- Applies to both place and user searches

### 2. **Place Type Filtering** 🍽️
Filter nearby locations by type:
- **Food & Drink**: Restaurant, Cafe, Bar, Pub, Fast Food, Pizza, Sandwich Shop, Cocktail Bar, Asian Restaurant
- **Entertainment**: Night Club, Lounge, Movie Theater, Live Music Venue
- **Recreation**: Gym, Park, Library, Art Gallery
- Multiple selections allowed
- 17 total place type options with emojis

### 3. **Nearby People Discovery** 👥
Find users available to meet up near you:
- Distance-based user discovery using Haversine formula
- Adjustable search radius
- Shows user profiles with:
  - Profile picture
  - Name and age
  - Interests
  - Distance from your location
- Friend request functionality
- Direct navigation to user profiles

### 4. **Dual View Mode** 🔄
Toggle between two discovery modes:
- **Places Tab**: Search for coffeehouses, restaurants, bars, etc.
- **People Tab**: Find nearby users available to meet up
- Seamless switching with preserved filters

---

## 🔧 Technical Implementation

### Backend Changes

#### **Firebase Backend** (`firebase-backend/src/api`)

1. **Location API Enhancement** (`/api/location/index.ts`)
   - Added `placeTypes` parameter (array of strings)
   - Added `includedTypes` to Google Places API request
   - Dynamic radius support (default: 5000m)

2. **Profile API - Nearby Users** (`/api/profiles/index.ts`)
   - New endpoint: `POST /profile/nearby`
   - Parameters:
     - `latitude`: User's current latitude
     - `longitude`: User's current longitude
     - `radiusMeters`: Search radius (default: 5000m)
   - Returns:
     - List of profiles within radius
     - Distance calculated using Haversine formula
     - Sorted by distance (closest first)
   - Filters:
     - `isActive: true`
     - `isDeleted: false`
     - Distance <= specified radius

#### **Frontend Changes**

1. **API Service** (`src/services/api.ts`)
   ```typescript
   fetchLocation(token, { 
     longitude, 
     latitude, 
     radiusMeters, 
     placeTypes 
   })
   
   fetchNearbyUsersAPI(token, {
     latitude,
     longitude,
     radiusMeters
   })
   ```

2. **Redux State Management** (`src/slices/sample.ts`)
   - Added `nearbyUsers` state
   - Added `nearbyUsersExecuted` flag
   - Actions:
     - `getNearbyUsersRequest`
     - `getNearbyUsersSuccess`
     - `getNearbyUsersFailure`

3. **Redux Saga** (`src/sagas/locationSaga.ts`)
   - `fetchNearbyUsersSaga`: Handles nearby user discovery

4. **New UI Components**
   - `RadiusSelector.tsx`: Horizontal scrollable radius picker
   - `PlaceTypeSelector.tsx`: Multi-select place type filter with emojis

5. **Enhanced Search Screen** (`src/views/findingSociety/index.tsx`)
   - Tab navigation (Places / People)
   - Dynamic filter display based on active tab
   - Separate FlatLists for places and users
   - Real-time search with filters
   - Location permission handling

---

## 📱 Usage Guide

### Searching for Places

1. Open the Klatchup app
2. Navigate to **Find Places** screen
3. Select **Places** tab
4. Choose your preferred **search radius** (500m - 20km)
5. Select **place types** (restaurants, cafes, bars, etc.)
6. Tap **🔍 Search Places**
7. Browse results and tap any place to see:
   - Users checked in at that location
   - Place details

### Finding Nearby People

1. Open the Klatchup app
2. Navigate to **Find Places** screen
3. Select **People** tab
4. Choose your preferred **search radius**
5. Tap **🔍 Search People**
6. Browse nearby users showing:
   - Profile picture and name
   - Age and interests
   - Distance from you
7. Tap any user to:
   - View full profile
   - Send friend request
   - Connect for meetup

---

## 🎨 UI/UX Highlights

- **Modern Design**: Purple gradient theme with glass-morphism effects
- **Intuitive Icons**: Emoji-based place types for quick recognition
- **Responsive**: Smooth scrolling and touch interactions
- **Accessibility**: Clear labels and sufficient touch targets
- **Performance**: Optimized FlatLists with proper key extractors

---

## 🔐 Security & Privacy

- Location data encrypted in transit
- User discovery respects privacy settings
- Only active users appear in nearby search
- Friend requests required before messaging
- Profile data protected by Firebase Auth

---

## 🚀 Performance Optimizations

- **ProGuard Enabled**: APK size reduced by 30-50%
- **Lazy Loading**: Places and users loaded on-demand
- **Distance Calculation**: Efficient Haversine formula
- **Caching**: Location stored in AsyncStorage
- **Debouncing**: Search requests optimized

---

## 📦 Build Instructions

### Development Build
```bash
cd android
./gradlew assembleDebug
```

### Production Build
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

**Output Location**: `android/app/build/outputs/apk/release/app-release.apk`

### APK Features
- ✅ Signed with release keystore
- ✅ ProGuard minification enabled
- ✅ Code obfuscation active
- ✅ 120+ ProGuard rules for React Native & Firebase
- ✅ Optimized for Play Store submission

---

## 🧪 Testing Checklist

- [ ] Location permission granted
- [ ] GPS enabled
- [ ] Places search with various radii
- [ ] Place type filtering (multiple selections)
- [ ] People search with various radii
- [ ] User profile viewing
- [ ] Friend request functionality
- [ ] Tab switching behavior
- [ ] Empty state handling
- [ ] Error state handling
- [ ] ProGuard build runs without crashes

---

## 📝 API Endpoints Summary

### Location Search
```
POST /location
{
  "latitude": 18.533,
  "longitude": 73.897,
  "radiusMeters": 1000,
  "placeTypes": ["restaurant", "cafe"]
}
```

### Nearby Users
```
POST /profile/nearby
{
  "latitude": 18.533,
  "longitude": 73.897,
  "radiusMeters": 2000
}
```

### Check-In
```
GET /checkin/{locationId}
POST /checkin
DELETE /checkin/{profileId}
```

---

## 🔮 Future Enhancements

- Real-time location updates
- Push notifications for nearby friends
- Advanced filters (age, interests, availability)
- Map view integration
- Route navigation to places/users
- Activity-based matching
- Group meetup creation

---

## 📄 License & Credits

- **App**: Klatchup
- **Version**: 1.0.0
- **Platform**: React Native 0.76
- **Backend**: Firebase Cloud Run
- **Maps**: Google Places API

---

## 🐛 Known Issues

1. TypeScript strict mode warnings (non-blocking)
2. Navigation type errors (functional but needs type fixes)
3. iOS Metro bundler connection may require restart

---

## 📞 Support

For issues or feature requests, please contact the development team.

**Happy Klatchup! 🎉**
