// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqM4gWsG-25a6j7u1yzu-OELuYAC_bfKA",
  authDomain: "educonnectlms.firebaseapp.com",
  projectId: "educonnectlms",
  storageBucket: "educonnectlms.appspot.com",
  messagingSenderId: "834219794524",
  appId: "1:834219794524:android:6759ac73cc66cb452c0699",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
