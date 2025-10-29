// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBh9Iq2OGfM3FnBDXCrNMrvNjWGI910Go4",
    authDomain: "gatekey-9bb64.firebaseapp.com",
    projectId: "gatekey-9bb64",
    storageBucket: "gatekey-9bb64.firebasestorage.app",
    messagingSenderId: "933663081375",
    appId: "1:933663081375:web:06ef33ba01392a7e5c73aa"
};

// Inicialização (usando compat para as tags antigas do HTML)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- Elementos do DOM ---
const statusMessage = document.getElementById('statusMessage');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const googleLoginButton = document.getElementById('googleLoginButton'); 
const linkToRegister = document.getElementById('linkToRegister');
const linkToLogin = document.getElementById('linkToLogin');
const linkToLoginFromForgot = document.getElementById('linkToLoginFromForgot');

// --- Funções de UI ---
function showMessage(message, type = 'error') {
    statusMessage.style.display = 'block';
    statusMessage.innerText = message;
    statusMessage.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    statusMessage.style.color = type === 'success' ? '#155724' : '#721c24';
    statusMessage.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`;
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

function showView(viewId) {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('registerView').style.display = 'none';
    document.getElementById('forgotPasswordView').style.display = 'none';
    document.getElementById(viewId).style.display = 'block';
}

// --- Listeners de Navegação ---
linkToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showView('registerView');
});
linkToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showView('loginView');
});
linkToLoginFromForgot.addEventListener('click', (e) => {
    e.preventDefault();
    showView('loginView');
});

// --- 1. LOGIN COM GOOGLE ---
const googleProvider = new firebase.auth.GoogleAuthProvider();

googleLoginButton.addEventListener('click', () => {
    showMessage('Iniciando Login com Google...', 'info');

    auth.signInWithPopup(googleProvider)
        .then((result) => {
            const user = result.user;
            
            db.collection("users").doc(user.uid).get().then(doc => {
                if (!doc.exists) {
                    db.collection("users").doc(user.uid).set({
                        email: user.email,
                        displayName: user.displayName,
                        role: 'colaborador',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        console.log("Novo usuário Google criado no Firestore.");
                    }).catch(error => {
                        console.error("Erro ao criar usuário no Firestore:", error);
                    });
                }
            });

            showMessage('Login com Google realizado com sucesso!', 'success');

        })
        .catch((error) => {
            let errorMessage = "Ocorreu um erro desconhecido no Login com Google.";
            
            if (error.code === 'auth/popup-closed-by-user') {
                 errorMessage = 'Login cancelado. O pop-up foi fechado.';
            } else if (error.code === 'auth/cancelled-popup-request') {
                 errorMessage = 'Pop-up bloqueado. Tente novamente.';
            } else if (error.email) {
                 errorMessage = `Erro ao autenticar a conta: ${error.email}. Verifique no Console.`;
            }
            console.error(error);
            showMessage(errorMessage);
        });
});

// --- 2. Login com Email/Senha ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            showMessage('Login com sucesso!', 'success');
        })
        .catch((error) => {
            console.error(error);
            showMessage('Erro ao fazer login. Verifique seu e-mail e senha.');
        });
});

// --- 3. Cadastro ---
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            return user.updateProfile({ displayName: name })
                .then(() => {
                    return db.collection("users").doc(user.uid).set({
                        email: user.email,
                        displayName: name,
                        role: 'colaborador',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                });
        })
        .then(() => {
            showMessage('Cadastro realizado com sucesso! Redirecionando...', 'success');
        })
        .catch((error) => {
            console.error(error);
            showMessage(`Erro no cadastro: ${error.message}`);
        });
});

// --- 4. Recuperação de Senha ---
forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('recoveryEmail').value;

    auth.sendPasswordResetEmail(email)
        .then(() => {
            showMessage('Link de recuperação enviado para o seu e-mail!', 'success');
            showView('loginView');
        })
        .catch((error) => {
            console.error(error);
            showMessage('Erro: E-mail não encontrado ou inválido.');
        });
});

// --- 5. Observador de Estado (Proteção de Rota e Redirecionamento) ---
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
             if (!doc.exists) {
                 db.collection("users").doc(user.uid).set({
                     email: user.email,
                     displayName: user.displayName,
                     role: 'colaborador',
                     createdAt: firebase.firestore.FieldValue.serverTimestamp()
                 }).then(() => {
                     window.location.href = "cadastrarDigital.html";
                 });
             } else {
                 window.location.href = "cadastrarDigital.html";
             }
        });
    } else {
        if (window.location.pathname.endsWith('cadastrarDigital.html')) {
            window.location.href = "index.html";
        }
        showView('loginView');
    }
});
