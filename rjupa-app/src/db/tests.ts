import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { TestDoc } from "../models/firestore";

export async function saveTest(test: Omit<TestDoc, "createdAt">) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("Not signed in");
    if (test.counts.fieldCounts36.length !== 36) throw new Error("fieldCounts36 must be length 36");

    const colRef = collection(db, "users", uid, "tests");
    const docRef = await addDoc(colRef, { ...test, createdAt: serverTimestamp() });

    return docRef.id;
}
