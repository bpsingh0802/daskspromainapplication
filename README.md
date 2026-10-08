# DakshPro

React Native mobile application built with Expo for local services, professionals, jobs, feeds, and communication.

## Requirements

- Node.js LTS
- npm
- Git
- Expo
- EAS CLI
- Android Studio for Android development
- Xcode for iOS development on macOS

## Installation

### 1. Open the project directory

```bash
cd /Volumes/Code/myapplicationtest1/app1/multiple-role-service-app
```

Make sure this folder contains `package.json`:

```bash
ls
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Install Expo dependencies

```bash
npx expo install
npx expo install react-native-worklets
```

## Environment Variables

Create `.env` in the project root, next to `package.json`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Do not commit real credentials to GitHub.

Create `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Add to `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

## Run Locally

```bash
cd /Volumes/Code/myapplicationtest1/app1/multiple-role-service-app
npm install --legacy-peer-deps
npx expo start
```

If you have cache issues:

```bash
npx expo start --clear
```

## Android

### Physical Android phone

1. Install Expo Go.
2. Connect phone and computer to the same Wi-Fi.
3. Run:

```bash
npx expo start
```

4. Scan the QR code with Expo Go.

### Android Emulator

Start an emulator in Android Studio, then run:

```bash
npx expo start
```

Press `a` to open Android.

## iOS

On macOS, install iOS dependencies if required:

```bash
npx pod-install
```

Then:

```bash
npx expo start
```

Press `i` to open the iOS Simulator.

## Check Configuration

```bash
npx expo doctor
npm list expo
```

This project uses Expo SDK 56.

## EAS Build

Install EAS CLI:

```bash
npm install -g eas-cli
```

Login:

```bash
eas login
eas whoami
```

### Android production build

```bash
eas build --platform android --profile production
```

Clean build:

```bash
eas build --platform android --profile production --clear-cache
```

### iOS production build

```bash
eas build --platform ios --profile production
```

## Google Play Internal Testing

1. Build the Android `.aab` with EAS.
2. Open Google Play Console.
3. Select DakshPro.
4. Go to **Testing → Internal testing**.
5. Create/select a release.
6. Upload the `.aab`.
7. Add testers.
8. Publish the internal testing release.
9. Share the tester opt-in link.

Android package name:

```text
com.dakshpro
```

## Supabase

Required variables:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Example:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Security

Anything beginning with `EXPO_PUBLIC_` can be included in the client application bundle.

Never put private server credentials in the mobile app. In particular, do not expose Twilio Auth Tokens in the Expo client. Twilio operations requiring secret credentials should run on a secure backend/server.

## Common Errors

### `package.json does not exist`

If you see:

```text
ConfigError: The expected package.json path: .../package.json does not exist
```

You are likely in the wrong directory. Run:

```bash
cd /Volumes/Code/myapplicationtest1/app1/multiple-role-service-app
npx expo start
```

### Dependency errors

```bash
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

### Expo Doctor / Worklets error

```bash
npx expo doctor
npx expo install react-native-worklets
```

## Project Structure

```text
multiple-role-service-app/
├── app/
├── assets/
├── components/
├── constants/
├── services/
├── .env
├── .env.example
├── .gitignore
├── app.json
├── eas.json
├── package.json
└── README.md
```

## Quick Start

```bash
cd /Volumes/Code/myapplicationtest1/app1/multiple-role-service-app
npm install --legacy-peer-deps
npx expo install react-native-worklets
npx expo start --clear
```

## Project Information

- **Application:** DakshPro
- **Android Package:** `com.dakshpro`
- **Expo SDK:** 56
- **React Native:** 0.85.x
- **Backend:** Supabase
- **Build:** EAS Build
- **Router:** Expo Router

## Development Commands

```bash
npx expo start
npx expo start --clear
npx expo doctor
eas build --platform android --profile production
eas build --platform ios --profile production
```
