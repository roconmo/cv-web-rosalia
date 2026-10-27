// Utilidades comunes a las webs de demostración

let demoToastTimer;

// Muestra un aviso breve en la parte inferior de la pantalla
function demoToast(text, ms = 4500) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(demoToastTimer);
  demoToastTimer = setTimeout(() => el.classList.remove("show"), ms);
}

// Los enlaces de WhatsApp de las demos no abren ningún número real
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-demo-whatsapp]");
  if (!link) return;
  e.preventDefault();
  demoToast("En la web real, este botón abriría el WhatsApp del negocio.");
});
