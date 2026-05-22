import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/** True when required VITE_FIREBASE_* vars are set (safe to check during SSR). */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

function ensureApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured) return null;
  if (app) return app;
  app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
  return app;
}

export function getClientAuth(): Auth | null {
  const firebaseApp = ensureApp();
  if (!firebaseApp) return null;
  authInstance ??= getAuth(firebaseApp);
  return authInstance;
}

export function getClientDb(): Firestore | null {
  const firebaseApp = ensureApp();
  if (!firebaseApp) return null;
  dbInstance ??= getFirestore(firebaseApp);
  return dbInstance;
}

export function getClientStorage(): FirebaseStorage | null {
  const firebaseApp = ensureApp();
  if (!firebaseApp) return null;
  storageInstance ??= getStorage(firebaseApp);
  return storageInstance;
}

export function getGoogleProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

export function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined" || !isFirebaseConfigured) {
    return Promise.resolve(null);
  }
  return isSupported().then((supported) => {
    const firebaseApp = ensureApp();
    if (!supported || !firebaseApp) return null;
    return getAnalytics(firebaseApp);
  });
}
