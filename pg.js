
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyBh9Iq2OGfM3FnBDXCrNMrvNjWGI910Go4",
  authDomain: "gatekey-9bb64.firebaseapp.com",
  databaseURL: "https://gatekey-9bb64-default-rtdb.firebaseio.com",
  projectId: "gatekey-9bb64",
  storageBucket: "gatekey-9bb64.firebasestorage.app",
  messagingSenderId: "933663081375",
  appId: "1:933663081375:web:06ef33ba01392a7e5c73aa"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginBtn = document.getElementById('login-btn');

const googleBtn = document.getElementById('google-btn');

const registerModal = document.getElementById('modal-register');
const resetModal = document.getElementById('modal-reset');
const showRegister = document.getElementById('show-register');
const showReset = document.getElementById('show-reset');
const closeButtons = document.querySelectorAll('[data-close]');

const registerForm = document.getElementById('register-form');
const regName = document.getElementById('reg-name');
const regEmail = document.getElementById('reg-email');
const regPassword = document.getElementById('reg-password');

const resetForm = document.getElementById('reset-form');
const resetEmail = document.getElementById('reset-email');

function openModal(modal){ modal.classList.remove('hidden'); }
function closeModal(modal){ modal.classList.add('hidden'); }

showRegister.addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); });
showReset.addEventListener('click', (e) => { e.preventDefault(); openModal(resetModal); });
closeButtons.forEach(btn => btn.addEventListener('click', () => {
  closeModal(registerModal); closeModal(resetModal);
}));

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginBtn.disabled = true;
  try {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert('Erro ao entrar: ' + (err.message || err));
    loginBtn.disabled = false;
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = regName.value.trim();
  const email = regEmail.value.trim();
  const password = regPassword.value;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    alert('Conta criada com sucesso. Você será direcionado para cadastrar a biometria.');
    closeModal(registerModal);
  } catch (err) {
    alert('Erro ao registrar: ' + (err.message || err));
  }
});

googleBtn.addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    alert('Erro no login com Google: ' + (err.message || err));
  }
});

resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = resetEmail.value.trim();
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Enviamos um link de recuperação para o seu e-mail.');
    closeModal(resetModal);
  } catch (err) {
    alert('Erro ao enviar link: ' + (err.message || err));
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    
    window.location.href = "cadastroDigital.html";
  } else {
   
  }
});
