/**
 * Santarém Reporta — Firebase
 * Substitua firebaseConfig pelos valores do console do Firebase.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBIW4XSftP3LREl0mi3ywzQutI7qoe8UDk",
  authDomain: "santarem-reporta-78531.firebaseapp.com",
  projectId: "santarem-reporta-78531",
  storageBucket: "santarem-reporta-78531.firebasestorage.app",
  messagingSenderId: "261807364035",
  appId: "1:261807364035:web:d6806e9af3c97f61b5cf76",
  measurementId: "G-RVYP537P1K",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const SECRETARIA_POR_TIPO = {
  buraco: "SEMINFRA",
  rua: "SEMINFRA",
  lixo: "SEMURB",
  iluminacao: "SEMURB",
  sinalizacao: "SMT",
  ambiental: "SEMMA",
};

const STATUS = ["pendente", "em_analise", "em_andamento", "resolvido"];

function secretariaDoTipo(tipo) {
  return SECRETARIA_POR_TIPO[tipo] || null;
}

function novoProtocolo() {
  const ano = new Date().getFullYear();
  const seq = String(Date.now()).slice(-6);
  return `SR-${ano}-${seq}`;
}

window.SR = {
  app,
  auth,
  db,
  storage,
  STATUS,
  SECRETARIA_POR_TIPO,
  secretariaDoTipo,
  novoProtocolo,
  serverTimestamp,
  // Auth
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  // Firestore
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  // Storage
  ref,
  uploadBytes,
  getDownloadURL,
};
