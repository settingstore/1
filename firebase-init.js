// firebase-init.js
// ------------------------------------------------------------------
// Configuración central de Firebase. La usan revendedores.html y
// admin.html. Estos valores NO son secretos (Firebase está diseñado
// así); la seguridad real la dan las Reglas de Firestore, no esto.
// ------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1yOfML1BFT0ug696tJBxgAzaW4ozWqTY",
  authDomain: "settings-store-5ec8a.firebaseapp.com",
  projectId: "settings-store-5ec8a",
  storageBucket: "settings-store-5ec8a.firebasestorage.app",
  messagingSenderId: "1056399498764",
  appId: "1:1056399498764:web:38d44b41c247fddb1b5829",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
  db,
  auth,
  storage,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  ref,
  uploadBytes,
  getDownloadURL,
};
