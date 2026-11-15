// Firebase жобасының баптаулары.
// Firebase Console → Project settings → General → Your apps → Web app
// бөлімінен алынған мәндерді осы жерге қойыңыз.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTDgm71p-5aR7eM5DYFhGr9P8_isablMA",
  authDomain: "fir-auth-project-1a63a.firebaseapp.com",
  projectId: "fir-auth-project-1a63a",
  storageBucket: "fir-auth-project-1a63a.firebasestorage.app",
  messagingSenderId: "972615941311",
  appId: "1:972615941311:web:a51d041c07095683341a0a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = "kk"; // Firebase хаттары қазақ тілінде
