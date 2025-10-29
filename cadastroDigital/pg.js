const statusArea = document.getElementById("status");
const btnCaptura = document.getElementById("btnCaptura");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

btnCaptura.addEventListener("click", () => {
  statusArea.classList.add("active");
  statusArea.textContent = "Capturando digital...";

  // Simula tempo de captura
  setTimeout(() => {
    statusArea.textContent = "Digital capturada com sucesso!";
    statusArea.classList.remove("active");
    btnSalvar.disabled = false;
  }, 3000);
});

btnSalvar.addEventListener("click", () => {
  alert("Digital salva com sucesso! (aqui entra sua integração real)");
  // Aqui você fará a chamada para o backend / API do leitor
  statusArea.textContent = "Aguardando nova captura...";
  btnSalvar.disabled = true;
});

btnCancelar.addEventListener("click", () => {
  statusArea.textContent = "Captura cancelada.";
  statusArea.classList.remove("active");
  btnSalvar.disabled = true;
});
