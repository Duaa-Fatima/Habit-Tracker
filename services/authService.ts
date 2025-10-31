import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, Habit, MoodLog } from '../types';
import { INITIAL_HABITS } from '../constants';

// --- Authentication Functions ---

export const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const user: User = { uid: firebaseUser.uid, email: firebaseUser.email };

    // Create a new user document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      email: user.email,
      habits: INITIAL_HABITS, // Start with initial habits
      plantGrowthLevel: 0,
      moodLogs: [],
    });

    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const user: User = { uid: firebaseUser.uid, email: firebaseUser.email };
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

export const checkAuthStatus = (callback: (user: User | null) => void): (() => void) => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user: User = { uid: firebaseUser.uid, email: firebaseUser.email };
      callback(user);
    } else {
      callback(null);
    }
  });
  return unsubscribe;
};


// --- User Data Functions ---

interface UserData {
  habits: Habit[];
  plantGrowthLevel: number;
  moodLogs: MoodLog[];
}

export const loadUserData = async (userId: string | undefined): Promise<UserData> => {
  if (!userId) {
    return { habits: INITIAL_HABITS, plantGrowthLevel: 0, moodLogs: [] };
  }
  const userDocRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserData;
  } else {
    return { habits: INITIAL_HABITS, plantGrowthLevel: 0, moodLogs: [] };
  }
};

export const saveUserData = async (userId: string | undefined, data: Partial<UserData>): Promise<void> => {
    if (!userId) {
    console.error("Attempted to save data without a userId.");
    return;
  }
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, data);
};
