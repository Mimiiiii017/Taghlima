// js/firebase.js - using Firebase via CDN (NO import)
const firebaseConfig = {
  apiKey: "AIzaSyBu7_GZowqjZLPN7UBwkv0LkmMuFqBgMN4",
  authDomain: "taghlima.firebaseapp.com",
  projectId: "taghlima",
  storageBucket: "taghlima.firebasestorage.app",
  messagingSenderId: "654704377136",
  appId: "1:654704377136:web:cabb32bb8593e2e4715cf5",
  measurementId: "G-YV6Q2RBRVP"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
window.auth = firebase.auth();       // ⬅️ Make globally available
window.db = firebase.firestore();    // ⬅️ Make globally available
