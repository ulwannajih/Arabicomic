import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserLearnerProfile, UserStats, SavedMufradatItem, BranchingScene } from '../types/comic';
import { INITIAL_BRANCHING_SCENES } from '../data/branchingStory';

interface AuthContextType {
  user: UserLearnerProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  userStats: UserStats;
  savedMufradat: SavedMufradatItem[];
  branchingScenes: BranchingScene[];
  loginWithGoogle: (asTeacher?: boolean) => Promise<void>;
  loginAsStudentGuest: (studentName: string) => void;
  loginAsTeacher: (user: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  saveWord: (word: { arabic: string; transliteration: string; indonesian: string; category?: string; episodeId?: string }) => Promise<void>;
  removeWord: (vocabId: string) => Promise<void>;
  isWordSaved: (arabic: string) => boolean;
  recordChoiceMade: (sceneId: string, pointsEarned: number) => Promise<void>;
  completeEpisode: (episodeId: string, starsCount: number, quizScore: number) => Promise<void>;
  saveCustomScene: (scene: BranchingScene) => void;
  deleteCustomScene: (sceneId: string) => void;
  resetScenes: () => void;
}

const DEFAULT_STATS: UserStats = {
  completedEpisodes: [],
  stars: 0,
  totalScore: 0,
  streakDays: 1,
  lastActive: new Date().toISOString(),
  visitedScenes: [],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserLearnerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userStats, setUserStats] = useState<UserStats>(DEFAULT_STATS);
  const [savedMufradat, setSavedMufradat] = useState<SavedMufradatItem[]>([]);
  const [branchingScenes, setBranchingScenes] = useState<BranchingScene[]>(() => {
    const saved = localStorage.getItem('yaumiyyatuna_branching_scenes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_BRANCHING_SCENES;
  });

  // Check saved session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('yaumiyyatuna_active_user');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.uid) {
          setUser(parsed);
          setLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem('yaumiyyatuna_active_user');
      }
    }

    // Subscribe to Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const isAppOwner = fbUser.email === 'ulwannajh@gmail.com';
        const role = isAppOwner ? 'teacher' : 'student';
        const profile: UserLearnerProfile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Santri Baru',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL || undefined,
          role: role,
          isAdmin: isAppOwner,
        };

        setUser(profile);
        localStorage.setItem('yaumiyyatuna_active_user', JSON.stringify(profile));

        // Sync to Firestore
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          await setDoc(
            userRef,
            {
              userId: fbUser.uid,
              email: fbUser.email,
              displayName: profile.displayName,
              photoURL: profile.photoURL || '',
              role: profile.role,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('Firestore sync user error:', err);
        }
      } else {
        const currentSaved = localStorage.getItem('yaumiyyatuna_active_user');
        if (!currentSaved) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore progress & saved mufradat when user is present
  useEffect(() => {
    if (!user) {
      setUserStats(DEFAULT_STATS);
      setSavedMufradat([]);
      return;
    }

    const localSavedStats = localStorage.getItem(`yaumiyyatuna_stats_${user.uid}`);
    if (localSavedStats) {
      try {
        setUserStats(JSON.parse(localSavedStats));
      } catch {}
    }

    const localMufradat = localStorage.getItem(`yaumiyyatuna_mufradat_${user.uid}`);
    if (localMufradat) {
      try {
        setSavedMufradat(JSON.parse(localMufradat));
      } catch {}
    }

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      const statsDocPath = `users/${user.uid}/progress/stats`;
      const unsubscribeStats = onSnapshot(
        doc(db, 'users', user.uid, 'progress', 'stats'),
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UserStats;
            setUserStats(data);
            localStorage.setItem(`yaumiyyatuna_stats_${user.uid}`, JSON.stringify(data));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, statsDocPath);
        }
      );

      const vocabCollectionPath = `users/${user.uid}/vocabulary`;
      const unsubscribeVocab = onSnapshot(
        collection(db, 'users', user.uid, 'vocabulary'),
        (snapshot) => {
          const items: SavedMufradatItem[] = [];
          snapshot.forEach((d) => {
            items.push({ id: d.id, ...d.data() } as SavedMufradatItem);
          });
          setSavedMufradat(items);
          localStorage.setItem(`yaumiyyatuna_mufradat_${user.uid}`, JSON.stringify(items));
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, vocabCollectionPath);
        }
      );

      return () => {
        unsubscribeStats();
        unsubscribeVocab();
      };
    }
  }, [user]);

  // Google Login
  const loginWithGoogle = async (asTeacher: boolean = false) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const isOwner = fbUser.email === 'ulwannajh@gmail.com';
      const learnerProfile: UserLearnerProfile = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || 'Santri Yaumiyyatuna',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || undefined,
        role: asTeacher || isOwner ? 'teacher' : 'student',
        isAdmin: isOwner,
      };
      setUser(learnerProfile);
      localStorage.setItem('yaumiyyatuna_active_user', JSON.stringify(learnerProfile));
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Student Guest login
  const loginAsStudentGuest = (studentName: string) => {
    const profile: UserLearnerProfile = {
      uid: `student_${Date.now()}`,
      displayName: studentName.trim() || 'Santri Pembelajar',
      email: 'siswa@yaumiyyatuna.edu',
      role: 'student',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUser(profile);
    localStorage.setItem('yaumiyyatuna_active_user', JSON.stringify(profile));
  };

  // Teacher login with username 'nisrinamaia' & password 'nisrinamaia1107'
  const loginAsTeacher = async (usernameInput: string, passwordInput: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Login guru gagal' };
      }

      if (data.success && data.user) {
        const teacherUser: UserLearnerProfile = {
          ...data.user,
          role: 'teacher',
        };
        setUser(teacherUser);
        localStorage.setItem('yaumiyyatuna_active_user', JSON.stringify(teacherUser));
        return { success: true };
      }
      return { success: false, message: 'Kredensial tidak valid' };
    } catch {
      // Fallback
      if (usernameInput === 'nisrinamaia' && passwordInput === 'nisrinamaia1107') {
        const teacherUser: UserLearnerProfile = {
          uid: 'teacher_nisrinamaia',
          displayName: 'Ustadzah Nisrina Maia (Guru)',
          email: 'nisrinamaia@yaumiyyatuna.edu',
          role: 'teacher',
          isAdmin: true,
          photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        };
        setUser(teacherUser);
        localStorage.setItem('yaumiyyatuna_active_user', JSON.stringify(teacherUser));
        return { success: true };
      }
      return { success: false, message: 'Username atau password salah' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      localStorage.removeItem('yaumiyyatuna_active_user');
      if (auth.currentUser) {
        await signOut(auth);
      }
      setUser(null);
      setUserStats(DEFAULT_STATS);
      setSavedMufradat([]);
    } catch (e) {
      console.error('Logout error:', e);
      setUser(null);
    }
  };

  // Save word to Mufradatku
  const saveWord = async (word: { arabic: string; transliteration: string; indonesian: string; category?: string; episodeId?: string }) => {
    if (!user) return;
    const cleanId = word.arabic.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').slice(0, 40) || `voc_${Date.now()}`;
    const newItem: SavedMufradatItem = {
      id: cleanId,
      arabic: word.arabic,
      transliteration: word.transliteration,
      indonesian: word.indonesian,
      category: word.category || 'Yaumiyyatuna',
      episodeId: word.episodeId || 'general',
      pos: 'isim',
      savedAt: new Date().toISOString(),
    };

    const updated = [...savedMufradat.filter((w) => w.arabic !== word.arabic), newItem];
    setSavedMufradat(updated);
    localStorage.setItem(`yaumiyyatuna_mufradat_${user.uid}`, JSON.stringify(updated));

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        const path = `users/${user.uid}/vocabulary/${cleanId}`;
        await setDoc(doc(db, 'users', user.uid, 'vocabulary', cleanId), {
          ...newItem,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/vocabulary/${cleanId}`);
      }
    }
  };

  const removeWord = async (vocabId: string) => {
    if (!user) return;
    const filtered = savedMufradat.filter((w) => w.id !== vocabId);
    setSavedMufradat(filtered);
    localStorage.setItem(`yaumiyyatuna_mufradat_${user.uid}`, JSON.stringify(filtered));

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'vocabulary', vocabId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/vocabulary/${vocabId}`);
      }
    }
  };

  const isWordSaved = (arabic: string) => {
    return savedMufradat.some((w) => w.arabic === arabic);
  };

  // Record branching choice made by student
  const recordChoiceMade = async (sceneId: string, pointsEarned: number) => {
    if (!user) return;
    const visited = userStats.visitedScenes || [];
    const alreadyVisited = visited.includes(sceneId);
    const updatedVisited = alreadyVisited ? visited : [...visited, sceneId];

    const updatedStats: UserStats = {
      ...userStats,
      visitedScenes: updatedVisited,
      stars: userStats.stars + (pointsEarned >= 25 ? 1 : 0),
      totalScore: userStats.totalScore + pointsEarned,
      lastActive: new Date().toISOString(),
    };

    setUserStats(updatedStats);
    localStorage.setItem(`yaumiyyatuna_stats_${user.uid}`, JSON.stringify(updatedStats));

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'progress', 'stats'), {
          ...updatedStats,
          userId: user.uid,
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Sync choice error:', e);
      }
    }
  };

  // Teacher mode scene management
  const saveCustomScene = (scene: BranchingScene) => {
    const existingIndex = branchingScenes.findIndex((s) => s.id === scene.id);
    let updated: BranchingScene[];
    if (existingIndex >= 0) {
      updated = [...branchingScenes];
      updated[existingIndex] = scene;
    } else {
      updated = [...branchingScenes, scene];
    }
    setBranchingScenes(updated);
    localStorage.setItem('yaumiyyatuna_branching_scenes', JSON.stringify(updated));
  };

  const deleteCustomScene = (sceneId: string) => {
    const filtered = branchingScenes.filter((s) => s.id !== sceneId);
    setBranchingScenes(filtered);
    localStorage.setItem('yaumiyyatuna_branching_scenes', JSON.stringify(filtered));
  };

  const resetScenes = () => {
    setBranchingScenes(INITIAL_BRANCHING_SCENES);
    localStorage.setItem('yaumiyyatuna_branching_scenes', JSON.stringify(INITIAL_BRANCHING_SCENES));
  };

  const completeEpisode = async (episodeId: string, starsCount: number, quizScore: number) => {
    if (!user) return;
    const alreadyCompleted = userStats.completedEpisodes.includes(episodeId);
    const newCompleted = alreadyCompleted
      ? userStats.completedEpisodes
      : [...userStats.completedEpisodes, episodeId];

    const updatedStats: UserStats = {
      ...userStats,
      completedEpisodes: newCompleted,
      stars: userStats.stars + starsCount,
      totalScore: userStats.totalScore + quizScore,
      lastActive: new Date().toISOString(),
    };

    setUserStats(updatedStats);
    localStorage.setItem(`yaumiyyatuna_stats_${user.uid}`, JSON.stringify(updatedStats));

    if (auth.currentUser && auth.currentUser.uid === user.uid) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'progress', 'stats'), {
          ...updatedStats,
          userId: user.uid,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Sync complete error:', err);
      }
    }
  };

  const isTeacher = useMemo(() => {
    return !!(user?.role === 'teacher' || user?.role === 'admin' || user?.isAdmin || user?.email === 'ulwannajh@gmail.com');
  }, [user]);

  const isAdmin = isTeacher;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isTeacher,
        userStats,
        savedMufradat,
        branchingScenes,
        loginWithGoogle,
        loginAsStudentGuest,
        loginAsTeacher,
        logout,
        saveWord,
        removeWord,
        isWordSaved,
        recordChoiceMade,
        completeEpisode,
        saveCustomScene,
        deleteCustomScene,
        resetScenes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
