
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
    import {
      getAuth, signOut, onAuthStateChanged
    } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
    import {
      getDatabase, ref, update, onValue
    } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

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
    const db = getDatabase(app);

    onAuthStateChanged(auth, (user) => {
      if (!user) window.location.href = "index.html";
    });

    window.logout = async () => {
      try {
        await signOut(auth);
        window.location.href = "index.html";
      } catch (err) {
        alert("Erro ao sair: " + err.message);
      }
    };

    const commandRef = ref(db, "/system/commands");
    const statusRef = ref(db, "/system/commands/status");

    // Envia comando de cadastro
    async function iniciarCadastro() {
      document.getElementById("status-box").textContent = "Enviando comando...";
      await update(commandRef, { command: "enroll" });
      document.getElementById("status-box").textContent = "Comando 'enroll' enviado! Aguarde o ESP32...";
    }

    // Envia comando de deleção
    async function apagarDigitais() {
      if (confirm("Tem certeza que deseja apagar TODAS as digitais?")) {
        document.getElementById("status-box").textContent = "Enviando comando de deleção...";
        await update(commandRef, { command: "delete" });
        document.getElementById("status-box").textContent = "Comando 'delete' enviado! Aguarde o ESP32...";
      }
    }

    // Monitoramento de status do ESP32
    onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      const statusBox = document.getElementById("status-box");

      if (status) {
        statusBox.textContent = "Status: " + status;
        const statusLower = status.toLowerCase();

        // Detector universal de finalização
        if (
          statusLower.includes("concluido") ||
          statusLower.includes("concluído") ||
          statusLower.includes("sucesso") ||
          statusLower.includes("salva") ||
          statusLower.includes("completo") ||
          statusLower.includes("complete") ||
          statusLower.includes("ok") ||
          statusLower.includes("finalizado") ||
          statusLower.includes("apagadas") ||
          statusLower.includes("apagado")
        ) {
          update(commandRef, { command: "aguardando" })
            .then(() => {
              console.log("Comando alterado para 'aguardando'");
              statusBox.textContent += " (Aguardando novo comando)";
            })
            .catch((error) => console.error("Erro ao atualizar comando:", error));
        }
      } else {
        statusBox.textContent = "Status: Aguardando...";
      }
    });

    window.addEventListener("DOMContentLoaded", () => {
      document.getElementById("start-biometric").addEventListener("click", iniciarCadastro);
      document.getElementById("delete-all").addEventListener("click", apagarDigitais);
    });