import {
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "./client";

let authPreparation: Promise<Auth> | undefined;

export function prepareAdminAuth() {
  authPreparation ??= (async () => {
    const auth = getAuth(getFirebaseApp());
    await setPersistence(auth, browserSessionPersistence);
    return auth;
  })();
  return authPreparation;
}

export async function observeAdminSession(callback: (user: User | null) => void) {
  const auth = await prepareAdminAuth();
  return onAuthStateChanged(auth, callback);
}

export async function signInAdminWithGoogle() {
  const auth = await prepareAdminAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWithRedirect(auth, provider);
}

export async function signOutAdmin() {
  const auth = await prepareAdminAuth();
  return signOut(auth);
}
