import { Slot } from "expo-router";

// NOTE: needed to move the Firebase and Auth initialization to
//       a lower level (app/(app)/_layout.tsx) so that Expo Router
//       can initialize completely.  Otherwise trying to redirect
//       the user to either the landing page or the welcome page
//       fails with 
export default function RootLayout() {
  return <Slot />;
}
