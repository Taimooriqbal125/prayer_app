# Sijda App – Project Documentation

## 1. Project Overview
**Sijda App** is a mobile Islamic companion application built to help users maintain daily worship routines through practical tools in one place.  
The app is developed with React Native and currently supports Android and iOS.

## 2. Purpose of the App
The main purpose of Sijda App is to provide a simple and reliable daily-use solution for:
- Checking prayer times based on user location
- Finding Qibla direction using device sensors
- Reading Surahs with offline support for selected content
- Performing digital Tasbih (Dhikr counter)

## 3. Core Features
### 3.1 Prayer Times
- Detects user location (with permission)
- Calculates prayer times using the Karachi method
- Shows next prayer countdown and daily prayer schedule

### 3.2 Qibla Finder
- Uses magnetometer sensor and geolocation
- Calculates Qibla angle based on current coordinates
- Shows directional guidance with calibration messaging

### 3.3 Quran / Surah Module
- Lists Surahs with status indicators
- Supports bundled/offline data and downloadable Surah data
- Allows users to manage offline Surah availability

### 3.4 Tasbih Counter
- Interactive digital counter with adjustable targets
- Phrase switching support
- Session-level total tracking

### 3.5 Onboarding and Navigation
- Introductory onboarding flow for new users
- Bottom-tab navigation for quick access to major modules

## 4. Technology Stack
### 4.1 Application Layer
- **React Native (CLI)** for cross-platform mobile development
- **React 19** and modern functional components with hooks

### 4.2 State Management
- **Redux Toolkit**
- **React Redux**
- Feature-sliced state structure (location, prayer times, qibla, quran, tasbih, app)

### 4.3 Navigation
- **React Navigation**
  - Bottom tabs
  - Stack navigation for Surah details and app flows

### 4.4 Device & Native Capabilities
- **react-native-geolocation-service** for GPS access
- **react-native-permissions** for runtime permission handling
- **react-native-sensors** for compass/magnetometer integration
- **react-native-mmkv** for local persistent storage

### 4.5 Prayer Time Calculation
- **praytime** library (Karachi method configuration)

### 4.6 UI and Supporting Libraries
- **react-native-safe-area-context**
- **react-native-screens**
- **react-native-gesture-handler**
- **react-native-reanimated**
- **react-native-svg**
- **@react-native-vector-icons** packages

### 4.7 Testing & Quality
- **Jest**
- **@testing-library/react-native**
- **ESLint** and **Prettier**

## 5. High-Level Architecture
Sijda App follows a modular structure:
- **screens/** for feature screens
- **components/** for reusable UI units
- **services/** for device/service logic (location, compass, permissions, qibla calculation, Surah loading)
- **redux/** for centralized state management and persistence
- **assets/** for static app resources and Surah data

This structure supports maintainability, feature scaling, and testability.

## 6. Platforms and Environment
- **Platforms:** Android, iOS
- **Node.js:** >= 20
- **Build tools:** React Native CLI, Gradle (Android), Xcode/CocoaPods (iOS)

## 7. How to Run the Project
1. Install dependencies:
   - `npm install`
2. Start Metro:
   - `npm start`
3. Run app:
   - Android: `npm run android`
   - iOS: `npm run ios`
4. Run tests:
   - `npm test`

## 8. Future Improvement Opportunities
- Prayer method customization (multiple fiqh/calculation methods)
- Expanded settings and personalization
- Notification/reminder system for prayer times
- Enhanced content module for duas and learning resources
- Stronger analytics and reliability monitoring

## 9. Conclusion
Sijda App is designed as a practical Islamic lifestyle utility with a clean user experience and a scalable technical foundation.  
Its current implementation combines prayer essentials, Qibla direction, Quran access, and Tasbih tracking in a single mobile solution suitable for daily use.
