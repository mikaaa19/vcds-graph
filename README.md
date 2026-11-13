# VCDS Graph – Android (offline)

Android packaging work is maintained on the `android-offline-app` branch.

## Build the Android app

Requirements: Node.js 18, Java 17, Android SDK / Android Studio.

```sh
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

The debug APK is generated at `android/app/build/outputs/apk/debug/app-debug.apk`.

A GitHub Actions workflow builds the APK for pushes to this branch and uploads it as the `vcds-graph-android-debug` artifact.

Imported measurements are saved in the app's local WebView storage. The application bundles its web assets; no application server is required at runtime.

Original project: https://github.com/jmullo/vcds-graph (MIT license).
