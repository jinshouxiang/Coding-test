import { initializeApp, getApps, getApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// App Hosting では FIREBASE_WEBAPP_CONFIG を JSON で注入できる
function getFirebaseConfig() {
  const injected = process.env.FIREBASE_WEBAPP_CONFIG
    ? JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG)
    : null;

  return {
    apiKey: injected?.apiKey ?? process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain:
      injected?.authDomain ?? process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:
      injected?.projectId ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:
      injected?.storageBucket ??
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      injected?.messagingSenderId ??
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: injected?.appId ?? process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId:
      injected?.measurementId ??
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

const firebaseConfig = getFirebaseConfig();

// アプリは作ってOK（これはサーバでも問題ない）
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ★ ここが重要：サーバでは Auth/Firestore を“作らない”
//   型は満たしつつ、実体はブラウザでだけ初期化する
export const auth: Auth =
  typeof window !== "undefined" ? getAuth(app) : (undefined as unknown as Auth);

export const db: Firestore =
  typeof window !== "undefined"
    ? getFirestore(app)
    : (undefined as unknown as Firestore);

// ブラウザ時のみ副作用
if (typeof window !== "undefined") {
  auth.languageCode = "ja";
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}
