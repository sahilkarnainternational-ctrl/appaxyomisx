import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type ClassLevel = | 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5' | 'Grade 6' | 'Grade 7' | 'Grade 8' | 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12' | 'Undergraduate' | 'Postgraduate';
export type Subject = | 'Science' | 'Mathematics' | 'Chemistry' | 'Physics' | 'Biology' | 'Astronomy' | 'AI & Computer Science' | 'History' | 'Geography' | 'English' | 'Social Studies';

export interface StudentProfile {
  studentName?: string;
  dateOfBirth?: string;
  country?: string;
  curriculum?: string;
}

export interface ParentInfo {
  name: string;
  email?: string;
  whatsapp?: string;
}

interface UserData {
  classLevel: ClassLevel;
  subjects: Subject[];
  studentProfile?: StudentProfile;
  parentInfo?: ParentInfo;
  secondaryParent?: ParentInfo;
  xp?: number;
  tier?: 'free' | 'premium';
}

interface UserContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  tier: 'free' | 'premium';
  xp: number;
  completeOnboarding: (data: Omit<UserData, 'xp' | 'tier'>) => Promise<void>;
  addXP: (points: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          // This is a new user, onboarding will set their data
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const completeOnboarding = async (data: Omit<UserData, 'xp' | 'tier'>) => {
    if (!user) throw new Error("User not authenticated to complete onboarding");
    const fullData: UserData = {
      ...data,
      xp: 0,
      tier: 'free', // Default to free tier
    };
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, fullData, { merge: true });
    setUserData(fullData);
  };

  const addXP = async (points: number) => {
    if (!user || !userData) return;
    const newXP = (userData.xp || 0) + points;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { xp: newXP }, { merge: true });
    setUserData(prev => prev ? { ...prev, xp: newXP } : null);
  };

  const value = {
    user,
    userData,
    loading,
    tier: userData?.tier || 'free',
    xp: userData?.xp || 0,
    completeOnboarding,
    addXP,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
