import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref as dbRef, get, set, child, remove, update, onValue, ref} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "apikey",
  authDomain: "database1-70eb6.firebaseapp.com",
  databaseURL: "databaseURL",
  projectId: "database1-70eb6",
  storageBucket: "database1-70eb6.firebasestorage.app", 
  messagingSenderId: "messagingSenderId",
  appId: "appId"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, dbRef, set, get, child, storage, storageRef, uploadBytes, getDownloadURL,
  auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, remove, deleteObject, update, onValue, ref };
