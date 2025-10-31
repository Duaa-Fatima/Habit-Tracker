import { User, Habit, MoodLog } from '../types';
import { INITIAL_HABITS } from '../constants';

const DB_KEY = 'aura_users_db';

// Helper to get the database from localStorage
const getDb = (): Record<string, any> => {
  try {
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : {};
  } catch {
    return {};
  }
};

// Helper to save the database to localStorage
const saveDb = (db: Record<string, any>) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// --- Authentication Functions ---

export const signUp = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
  const db = getDb();
  if (db[email]) {
    return { success: false, error: 'User with this email already exists.' };
  }

  // In a real app, you'd hash the password
  db[email] = {
    password,
    data: {
      habits: [], // New users start with an empty habit list
      plantGrowthLevel: 0,
      moodLogs: [], // Initialize mood logs for new users
    },
  };
  saveDb(db);

  const user = { email };
  localStorage.setItem('currentUser', JSON.stringify(user));
  return { success: true, user };
};

export const signIn = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
  const db = getDb();
  const userData = db[email];

  if (!userData || userData.password !== password) {
    return { success: false, error: 'Invalid email or password.' };
  }
  
  const user = { email };
  localStorage.setItem('currentUser', JSON.stringify(user));
  return { success: true, user };
};

export const signOut = () => {
  localStorage.removeItem('currentUser');
};

export const checkAuthStatus = (): User | null => {
  try {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  } catch {
    return null;
  }
};

// --- User Data Functions ---

interface UserData {
  habits: Habit[];
  plantGrowthLevel: number;
  moodLogs: MoodLog[];
}

export const loadUserData = (email: string): UserData => {
  const db = getDb();
  // New users or users with no data should start fresh.
  const defaultData = { habits: [], plantGrowthLevel: 0, moodLogs: [] };
  if (db[email]?.data) {
    // Ensure moodLogs exists to prevent errors for older users
    return { ...defaultData, ...db[email].data };
  }
  // Return default data if something is wrong
  return defaultData;
};

export const saveUserData = (email: string, data: UserData) => {
  const db = getDb();
  if (db[email]) {
    db[email].data = data;
    saveDb(db);
  }
};