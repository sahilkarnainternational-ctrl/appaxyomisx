import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy, limit, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
export const logActivity = async (uid, entry) => {
    try {
        await addDoc(collection(db, 'users', uid, 'activity'), {
            ...entry,
            uid,
            timestamp: Timestamp.now(),
        });
    }
    catch {
        // silent fail
    }
};
export const getTodayActivity = async (uid) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
        const q = query(collection(db, 'users', uid, 'activity'), where('timestamp', '>=', Timestamp.fromDate(today)), orderBy('timestamp', 'desc'), limit(100));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    catch {
        return [];
    }
};
export const getWeekActivity = async (uid) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    try {
        const q = query(collection(db, 'users', uid, 'activity'), where('timestamp', '>=', Timestamp.fromDate(weekAgo)), orderBy('timestamp', 'desc'), limit(300));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    catch {
        return [];
    }
};
export const getAllReviews = async () => {
    try {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        return snap.docs.map(d => d.data());
    }
    catch {
        return [];
    }
};
export const getUserReview = async (uid) => {
    try {
        const snap = await getDoc(doc(db, 'reviews', uid));
        return snap.exists() ? snap.data() : null;
    }
    catch {
        return null;
    }
};
export const submitReview = async (uid, data) => {
    const now = Timestamp.now();
    const existing = await getUserReview(uid);
    await setDoc(doc(db, 'reviews', uid), {
        uid,
        ...data,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
    });
};
export const deleteReview = async (uid) => {
    await deleteDoc(doc(db, 'reviews', uid));
};
