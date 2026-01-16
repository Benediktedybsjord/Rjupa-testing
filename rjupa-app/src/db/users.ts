import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { UserDoc } from "../models/firestore";

export async function ensureUserDoc() {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not signed in");

    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        const user: UserDoc = {
            createdAt: serverTimestamp(),
            credits: 0,
        };
        await setDoc(ref, user);
    }
}
