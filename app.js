// DINÁMICA CARRITO

const overlay = document.getElementById("overlayCarrito");
const btnAbrir = document.getElementById("btnCarrito");
const btnCerrar = document.getElementById("cerrarCarrito");
const btnComprar = document.getElementById("btnComprar");

// Link de Mercado Pago
const mpLink = "https://mpago.la/https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190eafba9930b25";

btnAbrir.addEventListener("click", () => {
  overlay.classList.add("active");

  // Evento GA4 (add_to_cart)
  if (typeof gtag === "function") {
    gtag("event", "add_to_cart", {
      currency: "ARS",
      value: 1000,
      items: [{ item_id: "crypto_plus", item_name: "Crypto+", quantity: 1 }]
    });
  }
});

btnCerrar.addEventListener("click", () => {
  overlay.classList.remove("active");
});

btnComprar.addEventListener("click", () => {
  // Evento GA4 (purchase)
  if (typeof gtag === "function") {
    gtag("event", "purchase", {
      transaction_id: "T" + Date.now(),
      currency: "ARS",
      value: 1000,
      items: [{ item_id: "crypto_plus", item_name: "Crypto+", quantity: 1 }]
    });
  }

  window.location.href = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190eafba9930b25";
});


// SWIPER JS

const swiper = new Swiper('.swiper', {
  loop: true, // Permite un bucle infinito
  autoplay: {
    delay: 1500, // Cambia de diapositiva cada 3 segundos
    disableOnInteraction: false, // Continúa el autoplay incluso si el usuario interactúa
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

