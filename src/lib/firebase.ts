
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-6777494424-ba8a4",
  "appId": "1:440869035195:web:f0b88edc1af7b52b52dd9e",
  "apiKey": "AIzaSyDZqDgHt87XkROQ6sYXS_AVnmv0aep1KvU",
  "authDomain": "studio-6777494424-ba8a4.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "440869035195"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
