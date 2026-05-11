# 🕌 Prayer App

A beautiful and feature-rich Islamic Prayer App built with React Native CLI. This app helps Muslims stay connected with their daily prayers, read Quran, find Qibla direction, and count Tasbih.

![React Native](https://img.shields.io/badge/React_Native-0.76-blue?logo=react)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- 🕐 **Prayer Times** - Accurate prayer times based on your location
- 🧭 **Qibla Compass** - Find the direction of Kaaba with built-in compass
- 📖 **Quran Reader** - Read Surahs with Arabic text and translations
- 📿 **Tasbih Counter** - Digital counter for Dhikr
- 🌙 **Beautiful UI** - Clean and intuitive user interface
- 📍 **Location Based** - Automatic location detection for accurate prayer times

## 📱 Screenshots

<!-- Add your app screenshots here -->
<!-- ![Home Screen](./screenshots/home.png) -->
<!-- ![Qibla Screen](./screenshots/qibla.png) -->

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- JDK 17

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Taimooriqbal125/prayer_app.git
   cd prayer_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS only - Install CocoaPods**
   ```bash
   bundle install
   bundle exec pod install
   ```

### Running the App

**Start Metro Bundler**
```bash
npm start
```

**Run on Android**
```bash
npm run android
```

**Run on iOS**
```bash
npm run ios
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🏗️ Project Structure

```
src/
├── assets/          # Images, fonts, and static data
├── components/      # Reusable UI components
│   ├── common/      # Common components (Cards, Buttons, etc.)
│   ├── icons/       # Icon components
│   ├── layout/      # Layout components
│   └── qibla/       # Qibla-specific components
├── constants/       # Theme, colors, and constants
├── navigation/      # React Navigation setup
├── redux/           # Redux store and slices
│   └── features/    # Feature-based slices
├── screens/         # App screens
│   ├── main/        # Main app screens
│   └── onboarding/  # Onboarding screens
├── services/        # API and device services
└── utils/           # Helper functions
```

## 🛠️ Built With

- [React Native](https://reactnative.dev/) - Mobile framework
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [React Navigation](https://reactnavigation.org/) - Navigation
- [React Native Sensors](https://github.com/react-native-sensors/react-native-sensors) - Compass/Sensor access

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📘 Project Documentation

For a complete professional project document (purpose, features, tech stack, and architecture), see:
- [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)

## 👨‍💻 Author

**Taimoor Iqbal**
- GitHub: [@Taimooriqbal125](https://github.com/Taimooriqbal125)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Taimooriqbal125/prayer_app/issues).

## ⭐ Show Your Support

Give a ⭐ if you like this project!

---

Made with ❤️ and ☕
