// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBQYt8RCZqx3UjEDQ5y3SuRn6aDOAqaKbo",
  authDomain: "kai-rooms.firebaseapp.com",
  databaseURL: "https://kai-rooms-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kai-rooms",
  storageBucket: "kai-rooms.firebasestorage.app",
  messagingSenderId: "191055952261",
  appId: "1:191055952261:web:b713a4c524762b0667ecec",
  measurementId: "G-L6QVZ2DPMN" // ini boleh tetap ada, tapi nggak dipakai
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
