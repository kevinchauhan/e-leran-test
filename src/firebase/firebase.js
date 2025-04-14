// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmhp3P2iISGEshV92WVMvN4caRUCzI96w",
  authDomain: "employee-management-syst-912b4.firebaseapp.com",
  projectId: "employee-management-syst-912b4",
  storageBucket: "employee-management-syst-912b4.appspot.com",
  messagingSenderId: "166335151658",
  appId: "1:166335151658:web:82a4c3650e16a4f9eb8d53"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const realtimeDb = getDatabase(app);
