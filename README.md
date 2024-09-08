# Simple Expo/React-Native App with Expo Router and User Profiles using Firebase Auth + Firestore

This repository is an Expo/React-Native project that uses a simple, _reusable_ pattern for connecting to Firebase services and leveraging Firebase Authentication and Firestore for user registration, login, logout and "dynamically watching" user profile data in real-time.

This project was created with `npx create-expo-app`. It uses Expo Router for navigation, and Firebase for Auth and Firestore Database.

NOTE: minimal time was spent on styling in order to focus on Firebase functionality, so the UI is extremely basic (ie: ugly).

NOTE #2: This is a peer project to [react-and-user-profiles-with-firebase-auth-and-firestore](https://github.com/gregfenton/react-and-user-profiles-with-firebase-auth-and-firestore). The goal is to have the two providers (`FirebaseProvider` and `AuthProvider`) be _nearly identical_ in both projects.

## &lt;FirebaseProvider /&gt;

This component configures the app with your Firebase project's configuration information (the _firebaseConfig_), and gets the various Firebase services available for the rest of the app to use. The component uses React's Context API to make the services available. The `firebaseConfig` is stored in a JSON file in the `src/providers` folder; details below.

## &lt;AuthProvider /&gt;

This component uses the Firebase Auth service (it gets from the &lt;FirebaseProvider /&gt;) to enable the AuthStateChanged listener, makes available functions: `login()`, `logout()` and `register()`, upon successful registration stores "user profile" data to Firestore, and upon a successful login fetches the "user profile" data for the currently logged in user.

## To Run This Project

1. `git clone https://github.com/gregfenton/expo-and-user-profiles-with-firebase-auth-and-firestore.git`
1. `cd expo-and-user-profiles-with-firebase-auth-and-firestore`
1. `npm install expo@latest` to install Expo
1. `npx expo install` to install the remaining NPM dependencies
1. Open your favourite code editor (e.g. `code .` to run VSCode on this project)
1. Ensure your Firebase project has enabled the Email/Password sign-in provider:
   - Firebase Console >> YOUR_PROJECT >> Authentication >> Sign-In Method
   - If "Email/Password" is not listed under Sign-In Providers, click _Add New Provider_ and add it
   - Ensure that Email/Password is _Enabled_
1. Ensure your Firebase project has enabled the Firestore Database:
   - Firebase Console >> YOUR_PROJECT >> Firestore Database
   - if you see a _Create Database_ button, click it
     - if prompted for Security Rules, choose to go with **_test mode_** for now
1. Copy the file `providers/firebaseConfig.json.example` to `providers/firebaseConfig.json`
1. Edit the file `providers/firebaseConfig.json` and replace the file's contents with your Firebase project's configuration (see initial contents of the JSON file for instructions)
1. `npm run start` to start the Expo development server
1. Once started, click `i` to start the iOS simulator, `a` to start the Android emulator, `w` to open the web browser, or `q` to quit the Expo CLI

In the running app:

1. If you have an existing account in your Firebase Authentication the enter the email, password and click the Login button.
2. If you'd like to register a new account, click the Register button.
3. Once logged in, you will be presented with the `displayName` and `email` values that are in Firestore >> `users` >> [the UID from Firebase Auth]

You might also keep the "Welcome!" page showing and use Firebase Console >> Firestore to change the `displayName` of the user document. You will see the Expo app update its UI in real-time.

## To Use This Project In Your Own Expo App

The main parts of this app that is _reusable_ are `FirebaseProvider` and `AuthProvider`, both located in `src/providers`.

To use them, copy these two files into your Expo app, and somewhere near the top of your app's component tree "wrap" the parts of your app you want to use Firebase in with these two providers. In this project, the wrapping happens in `app/(app)/_layout.tsx`:

```js
return (
  <FirebaseProvider>
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  </FirebaseProvider>
);
```

where `<RootLayoutNav />` represents the rest of your app's Expo Router configuration.

Then in components `<RootLayoutNav />` or its descendants you can use the hooks:

- `useFirebaseContext()` to access the various handles to Firebase services: `myApp`, `myAuth`, `myFS`, `myStorage` and emulator settings `usingEmulators` and `emulatorsConfig`.
- `useAuthContext()` to access the `login()`, `logout()` and `register()` functions, the `profile` object that contains the `displayName` and `email` values from the user's Firestore "user profile" document, and the `user` object from Firebase Auth that is set when the user login process completes successfully (i.e. it is set by the onAuthStateChanged() listener)
