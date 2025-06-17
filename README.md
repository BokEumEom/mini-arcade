# Game App

A React Native mobile game application built with Expo and TypeScript.

## Features

- Modern React Native development with Expo
- TypeScript for type safety
- File-based routing with Expo Router
- Multiple game experiences
- Haptic feedback integration
- Custom animations
- Responsive layouts
- Asset management for fonts, images, and animations

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   # or
   npx expo start
   ```

3. Run on specific platforms:

   ```bash
   # For iOS
   npm run ios

   # For Android
   npm run android

   # For web
   npm run web
   ```

## Project Structure

- `/app` - Main application screens and navigation setup
- `/assets` - Static assets (animations, fonts, images, icons)
- `/components` - Reusable UI components
- `/constants` - Application-wide constants
- `/contexts` - React Context providers
- `/hooks` - Custom React hooks
- `/types` - TypeScript type definitions
- `/utils` - Utility functions

## Development

- Edit files in the `/app` directory to modify screens and navigation
- Use the `reset-project` script to start fresh:

  ```bash
  npm run reset-project
  ```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Start the app in iOS simulator
- `npm run android` - Start the app in Android emulator
- `npm run web` - Start the app in web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset the project to a clean state

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
