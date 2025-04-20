// firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBn47Gk8LdKtTiNHJe5uSZ5pk8Tt7E8XbI",
  authDomain: "waterquality-ec515.firebaseapp.com",
  databaseURL: "https://waterquality-ec515-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "waterquality-ec515",
  storageBucket: "waterquality-ec515.appspot.com",
  messagingSenderId: "728439014713",
  appId: "1:728439014713:web:3c1cfa2feedd65eab1d4e8"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export { db, ref, onValue };
