/* =========================================================
   Aviso de cookies y carga de Google Analytics con consentimiento
   - Analytics solo se carga si el visitante acepta.
   - La elección se guarda en el navegador (localStorage) y se
     puede cambiar con cualquier enlace que llame a
     rousCookies.open() (pie de página: "Configurar cookies").
   ========================================================= */
(function () {
  var GA_ID = "G-BF1MPYX4HK";
  var KEY = "rous-cookie-consent"; // "accepted" | "rejected"
  var en = (document.documentElement.lang || "es").slice(0, 2) === "en";

  var T = en
    ? {
        text: "This website uses analytics cookies (Google Analytics) to understand how it is used. They are only installed if you accept.",
        more: "Cookie policy",
        moreUrl: "/en/legal/cookies.html",
        accept: "Accept",
        reject: "Reject",
      }
    : {
        text: "Esta web usa cookies de análisis (Google Analytics) para saber cómo se utiliza. Solo se instalan si las aceptas.",
        more: "Política de cookies",
        moreUrl: "/legal/cookies.html",
        accept: "Aceptar",
        reject: "Rechazar",
      };

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { /* sin almacenamiento: se volverá a preguntar */ }
  }

  function loadAnalytics() {
    if (window.__rousGaLoaded) return;
    window.__rousGaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  // Borra las cookies de Analytics si el visitante retira su consentimiento
  function clearAnalyticsCookies() {
    var host = location.hostname;
    var domains = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid" || name === "_gat") {
        domains.forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
        });
      }
    });
  }

  function addStyles() {
    if (document.getElementById("rous-cookie-style")) return;
    var css =
      "#rous-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:640px;margin:0 auto;" +
      "background:#0d2a1f;color:#fff;border:1px solid rgba(200,241,105,.35);border-radius:14px;padding:16px 18px;" +
      "box-shadow:0 16px 40px rgba(0,0,0,.35);font:400 14px/1.5 Inter,system-ui,-apple-system,'Segoe UI',sans-serif}" +
      "#rous-cookie p{margin:0 0 12px}" +
      "#rous-cookie a{color:#c8f169;text-decoration:underline}" +
      "#rous-cookie .rc-actions{display:flex;gap:10px;flex-wrap:wrap}" +
      "#rous-cookie button{flex:1 1 140px;padding:10px 14px;border-radius:999px;border:1px solid #c8f169;" +
      "background:transparent;color:#fff;font:600 14px Inter,system-ui,sans-serif;cursor:pointer}" +
      "#rous-cookie button:hover,#rous-cookie button:focus-visible{background:#c8f169;color:#0d2a1f;outline:none}";
    var st = document.createElement("style");
    st.id = "rous-cookie-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function close() {
    var b = document.getElementById("rous-cookie");
    if (b) b.remove();
  }

  function open() {
    close();
    addStyles();
    var box = document.createElement("div");
    box.id = "rous-cookie";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-live", "polite");
    box.setAttribute("aria-label", en ? "Cookie settings" : "Configuración de cookies");

    var p = document.createElement("p");
    p.textContent = T.text + " ";
    var a = document.createElement("a");
    a.href = T.moreUrl;
    a.textContent = T.more;
    p.appendChild(a);

    var actions = document.createElement("div");
    actions.className = "rc-actions";
    var rej = document.createElement("button");
    rej.type = "button";
    rej.textContent = T.reject;
    var acc = document.createElement("button");
    acc.type = "button";
    acc.textContent = T.accept;
    actions.appendChild(rej);
    actions.appendChild(acc);

    rej.addEventListener("click", function () {
      var wasAccepted = read() === "accepted";
      save("rejected");
      clearAnalyticsCookies();
      close();
      if (wasAccepted && window.__rousGaLoaded) location.reload();
    });
    acc.addEventListener("click", function () {
      save("accepted");
      close();
      loadAnalytics();
    });

    box.appendChild(p);
    box.appendChild(actions);
    document.body.appendChild(box);
  }

  window.rousCookies = { open: open };

  function init() {
    var choice = read();
    if (choice === "accepted") loadAnalytics();
    else if (choice !== "rejected") open();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
