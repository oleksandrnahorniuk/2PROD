import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref as dbRef, get, set, child, remove, update, onValue, ref} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCv4LjQw9lXo5-WwBK6d6_UFwwx4m9Cc6k",
  authDomain: "database1-70eb6.firebaseapp.com",
  databaseURL: "https://database1-70eb6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "database1-70eb6",
  storageBucket: "database1-70eb6.firebasestorage.app", // Без изменений
  messagingSenderId: "189652369598",
  appId: "1:189652369598:web:2fb028fd96327d5d47deef"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, dbRef, set, get, child, storage, storageRef, uploadBytes, getDownloadURL,
  auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, remove, deleteObject, update, onValue, ref };
