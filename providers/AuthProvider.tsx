import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import {doc, DocumentData, onSnapshot, serverTimestamp, setDoc} from 'firebase/firestore';
import {createContext, useContext, useEffect, useState} from 'react';

import {useFirebaseContext} from './FirebaseProvider';

export interface IAuthContext {
  authErrorMessages?: string[];
  authLoading: boolean;
  profile?: DocumentData;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (email: string, password: string, displayName?: string) => Promise<boolean>;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const PROFILE_COLLECTION = 'users'; // name of the FS collection of user profile docs

interface IProps {
  children: React.ReactNode;
}

export const AuthProvider = (props: IProps) => {
  const {children} = props;

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DocumentData>();
  const [authLoading, setAuthLoading] = useState(true);
  const [authErrorMessages, setAuthErrorMessages] = useState<string[]>();

  const {myAuth, myFS} = useFirebaseContext();

  // hook into Firebase Authentication
  useEffect(() => {
    if (myAuth) {
      let unsubscribe = onAuthStateChanged(myAuth, (user) => {
        setUser(user);
        setAuthLoading(false);
      });

      return unsubscribe;
    }
  }, [myAuth]);

  // listen to the user profile (FS User doc)
  useEffect(() => {
    const listenToUserDoc = (uid: string) => {
      let docRef = doc(myFS, PROFILE_COLLECTION, uid);
      return onSnapshot(
        docRef,
        (docSnap) => {
          let profileData = docSnap.data();
          console.log('<AuthProvider>: got user profile:', profileData, docSnap);
          if (!profileData) {
            setAuthErrorMessages([`No profile doc found in Firestore at: ${docRef.path}`]);
          }
          setProfile(profileData);
        },
        (firestoreErr) => {
          console.error(
            `<AuthProvider>: onSnapshot() callback failed with: ${firestoreErr.message}`,
            firestoreErr,
          );
          setAuthErrorMessages([
            firestoreErr.message,
            'Have you initialized your Firestore database?',
          ]);
        },
      );
    };

    if (user?.uid) {
      const unsubscribeFn = listenToUserDoc(user.uid);

      return unsubscribeFn;
    } else if (!user) {
      setAuthLoading(true);
      setProfile(undefined);
      setAuthErrorMessages(undefined);
    }
  }, [user, setProfile, myFS]);

  /**
   *
   * @param email email address and "login ID" for the new account
   * @param password password to use for the new account
   * @param displayName optional display name for the new account
   * @returns `true` if the account is created, `false` otherwise
   */
  const registerFunction = async (
    email: string,
    password: string,
    displayName: string = '',
  ): Promise<boolean> => {
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(myAuth, email, password);
    } catch (ex) {
      const msg = Object.hasOwnProperty.call(ex, 'message')
        ? (ex as Record<string, string>).message
        : JSON.stringify(ex);
      console.error(`<AuthProvider>: registerFunction() failed with: ${msg}`);
      setAuthErrorMessages([msg, 'Did you enable the Email Provider in Firebase Auth?']);
      return false;
    }

    try {
      let user = userCredential.user;

      let userDocRef = doc(myFS, 'users', user.uid);
      let userDocData = {
        uid: user.uid,
        email: email,
        displayName: displayName,
        dateCreated: serverTimestamp(),
      };

      await setDoc(userDocRef, userDocData);
      return true;
    } catch (ex) {
      const msg = Object.hasOwnProperty.call(ex, 'message')
        ? (ex as Record<string, string>).message
        : JSON.stringify(ex);
      console.error(`<AuthProvider>: registerFunction() failed with: ${msg}`);
      setAuthErrorMessages([
        msg,
        'Did you enable the Firestore Database in your Firebase project?',
      ]);
      return false;
    }
  };

  const loginFunction = async (email: string, password: string) => {
    try {
      let userCredential = await signInWithEmailAndPassword(myAuth, email, password);

      let user = userCredential.user;
      if (!user?.uid) {
        let msg = `No UID found after signIn!`;
        console.error(msg);
      }
      if (user) {
        console.log(`Logged in as uid(${user.uid}) email(${user.email})`);
      }
      setUser(user);
      return true;
    } catch (ex) {
      const msg = Object.hasOwnProperty.call(ex, 'message')
        ? (ex as Record<string, string>).message
        : JSON.stringify(ex);
      console.error(`<AuthProvider>: Login failure for email(${email}: ${msg})`);
      setAuthErrorMessages([msg]);
      return false;
    }
  };

  const logoutFunction = async () => {
    try {
      setUser(null); // shut down the listeners
      await signOut(myAuth);
      console.log('Signed Out');
      return true;
    } catch (ex) {
      const msg = Object.hasOwnProperty.call(ex, 'message')
        ? (ex as Record<string, string>).message
        : JSON.stringify(ex);
      console.error(msg);
      setAuthErrorMessages([msg]);
      return false;
    }
  };

  if (authLoading) {
    return null;
  }

  const theValues = {
    authErrorMessages,
    authLoading,
    profile,
    user,
    login: loginFunction,
    logout: logoutFunction,
    register: registerFunction,
  };

  return <AuthContext.Provider value={theValues}>{children}</AuthContext.Provider>;
};

/**
 * A hook that returns the AuthContext's values.
 */
export const useAuthContext = () => {
  // get the context
  const context = useContext(AuthContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error('useAuthContext was used outside of its Provider');
  }

  return context;
};
