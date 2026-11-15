import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ---------- Көмекші функциялар ----------

// Firebase қате кодтарын қазақ тіліндегі хабарламаға аудару
const ERRORS = {
  "auth/email-already-in-use": "Бұл email бұрын тіркелген.",
  "auth/invalid-email": "Email форматы қате.",
  "auth/weak-password": "Құпиясөз тым әлсіз (кемінде 6 таңба).",
  "auth/user-not-found": "Мұндай пайдаланушы табылмады.",
  "auth/wrong-password": "Құпиясөз қате.",
  "auth/invalid-credential": "Email немесе құпиясөз қате.",
  "auth/too-many-requests": "Әрекет тым көп. Біраз уақыттан кейін қайталаңыз.",
  "auth/popup-closed-by-user": "Google терезесі жабылды.",
  "auth/network-request-failed": "Интернет байланысын тексеріңіз."
};
const errorText = (e) => ERRORS[e.code] || "Қате орын алды: " + e.message;

function showMessage(text, type = "error") {
  const box = document.getElementById("message");
  if (!box) return;
  box.textContent = text;
  box.className = "message " + type;
}

function setLoading(form, isLoading) {
  const btn = form.querySelector("button[type=submit]");
  if (btn) btn.disabled = isLoading;
}

const page = document.body.dataset.page;
const google = new GoogleAuthProvider();

// ---------- Беттерді қорғау (маршрутизация) ----------
onAuthStateChanged(auth, (user) => {
  if (page === "dashboard") {
    if (!user) {
      window.location.replace("index.html");   // кірмеген адамды жібермеу
      return;
    }
    renderDashboard(user);
  } else if (user && (page === "login" || page === "register")) {
    window.location.replace("dashboard.html"); // кірген адамды бірден кабинетке
  }
});

// ---------- Тіркелу ----------
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const confirm = registerForm.confirm.value;

    if (password !== confirm) return showMessage("Құпиясөздер сәйкес келмейді.");
    if (password.length < 6) return showMessage("Құпиясөз кемінде 6 таңбадан тұруы керек.");

    setLoading(registerForm, true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await sendEmailVerification(cred.user);
      // onAuthStateChanged өзі dashboard.html бетіне бағыттайды
    } catch (err) {
      showMessage(errorText(err));
    } finally {
      setLoading(registerForm, false);
    }
  });
}

// ---------- Кіру ----------
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(loginForm, true);
    try {
      await signInWithEmailAndPassword(auth, loginForm.email.value.trim(), loginForm.password.value);
    } catch (err) {
      showMessage(errorText(err));
    } finally {
      setLoading(loginForm, false);
    }
  });
}

// ---------- Google арқылы кіру ----------
const googleBtn = document.getElementById("google-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, google);
    } catch (err) {
      showMessage(errorText(err));
    }
  });
}

// ---------- Құпиясөзді қалпына келтіру ----------
const resetForm = document.getElementById("reset-form");
if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    setLoading(resetForm, true);
    try {
      await sendPasswordResetEmail(auth, resetForm.email.value.trim());
      showMessage("Құпиясөзді қалпына келтіру сілтемесі поштаңызға жіберілді.", "success");
    } catch (err) {
      showMessage(errorText(err));
    } finally {
      setLoading(resetForm, false);
    }
  });
}

// ---------- Жеке кабинет ----------
function renderDashboard(user) {
  document.getElementById("user-name").textContent = user.displayName || "Пайдаланушы";
  document.getElementById("user-email").textContent = user.email;
  document.getElementById("user-provider").textContent =
    user.providerData[0]?.providerId === "google.com" ? "Google" : "Email/құпиясөз";
  document.getElementById("user-verified").textContent =
    user.emailVerified ? "Расталған ✔" : "Расталмаған — поштаңызды тексеріңіз";
  document.getElementById("user-created").textContent =
    new Date(user.metadata.creationTime).toLocaleString("kk-KZ");
  document.getElementById("user-last").textContent =
    new Date(user.metadata.lastSignInTime).toLocaleString("kk-KZ");

  const avatar = document.getElementById("avatar");
  if (user.photoURL) {
    avatar.innerHTML = "";
    const img = document.createElement("img");
    img.src = user.photoURL;
    img.alt = "";
    avatar.appendChild(img);
  } else {
    avatar.textContent = (user.displayName || user.email)[0].toUpperCase();
  }
  document.body.classList.remove("loading");
}

const verifyBtn = document.getElementById("verify-btn");
if (verifyBtn) {
  verifyBtn.addEventListener("click", async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      showMessage("Растау хаты қайта жіберілді.", "success");
    } catch (err) {
      showMessage(errorText(err));
    }
  });
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => signOut(auth));
}
