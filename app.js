// // DINÁMICA CARRITO

// const overlay = document.getElementById("overlayCarrito");
// const btnAbrir = document.getElementById("btnCarrito");
// const btnCerrar = document.getElementById("cerrarCarrito");
// const btnComprar = document.getElementById("btnComprar");

// // Link de Mercado Pago
// const mpLink = "https://mpago.la/https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190eafba9930b25";

// btnAbrir.addEventListener("click", () => {
//   overlay.classList.add("active");

//   // Evento GA4 (add_to_cart)
//   if (typeof gtag === "function") {
//     gtag("event", "add_to_cart", {
//       currency: "ARS",
//       value: 1000,
//       items: [{ item_id: "crypto_plus", item_name: "Crypto+", quantity: 1 }]
//     });
//   }
// });

// btnCerrar.addEventListener("click", () => {
//   overlay.classList.remove("active");
// });

// btnComprar.addEventListener("click", () => {
//   // Evento GA4 (purchase)
//   if (typeof gtag === "function") {
//     gtag("event", "purchase", {
//       transaction_id: "T" + Date.now(),
//       currency: "ARS",
//       value: 1000,
//       items: [{ item_id: "crypto_plus", item_name: "Crypto+", quantity: 1 }]
//     });
//   }

//   window.location.href = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190eafba9930b25";
// });


// SWIPER JS

// DINÁMICA CARRITO

// Solo agrega el producto si el botón existe en la página actual
document.addEventListener('DOMContentLoaded', () => {
  const btnAgregar = document.getElementById('btnCarrito');
  if (btnAgregar) {
    btnAgregar.addEventListener('click', (e) => {
      e.preventDefault(); // Evita que el enlace recargue la página
      localStorage.setItem('productoEnCarrito', 'true');
      // Opcional: redirigir al carrito automáticamente
      //window.location.href = 'cart.html';
      alert('Producto agregado al carrito. ¡Gracias por tu compra!');
    });
  }

  // Mostrar el producto en el carrito
  const contenedor = document.getElementById('cart-container');
  if (contenedor) {
    const productoAgregado = localStorage.getItem('productoEnCarrito') === 'true';
    if (productoAgregado) {
      contenedor.innerHTML = `
                <h3 class="product-title">CRYPTO+</h3>
                <p class="product-price">Precio: $26.400 + <span style="font-weight: bold;">IVA</span></p>
                <button class="product-buy nav-link nav-link-secondary">Finalizar Compra</button>
                <button class="product-delete">Eliminar Producto</button>
            `;

      // Eliminar producto
      const btnEliminar = document.querySelector('.product-delete');
      if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
          localStorage.setItem('productoEnCarrito', 'false');
          location.reload();
        });
      }

      // Finalizar compra
      const btnComprar = document.querySelector('.product-buy');
      if (btnComprar) {
        btnComprar.addEventListener('click', () => {
          // Evento GA4 (purchase) con gtag
          if (typeof gtag === "function") {
            gtag("event", "purchase", {
              transaction_id: "T" + Date.now(),
              currency: "ARS",
              value: 26400,
              items: [{ item_id: "crypto_plus", item_name: "Crypto+", quantity: 1 }]
            });
          }
          window.location.href = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190eafba9930b25";
          alert('¡Serás redirigido a Mercado Pago!.');
        });
      }
    } else {
      contenedor.innerHTML = '<p class="hero-p-secondary">¡Tu carrito está <span style="font-weight: bolder;">vacío</span>, hacé click en "AGREGAR AL CARRITO" dentro de la sección <a href="crypto_plus.html" style=color: #9933CC;>Crypto+</a> para <span style="font-weight: bolder;">llenarlo</span>!</p>';
    }
  }
});


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

