import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

export async function firestoreSmokeTest() {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not authenticated");
    }

    const uid = user.uid;

    const ref = doc(db, "users", uid, "tests", "smoke-test");

    await setDoc(ref, {
        createdAt: serverTimestamp(),
        note: "Firestore smoke test OK",
    });

    const snap = await getDoc(ref);

    return snap.data();
}
