// DINÁMICA CARRITO

document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTOS DEL MODAL LOGIN
  const overlayLogin = document.getElementById("overlayLogin");
  const btnSubscribe = document.getElementById("btnSubscribe");
  const btnCerrarLogin = document.getElementById("cerrarLogin");
  const loginForm = document.getElementById("loginForm");

  // ELEMENTOS DEL USUARIO
  const userControls = document.getElementById("userControls");
  const userDisplayName = document.getElementById("userDisplayName");
  const btnLogout = document.getElementById("btnLogout");

  // FUNCIÓN PARA ACTUALIZAR UI DE USUARIO
  const updateUserUI = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userName = localStorage.getItem("userName") || localStorage.getItem("userEmail");

    if (isLoggedIn && userControls) {
      userControls.style.display = "flex";
      if (userDisplayName) userDisplayName.textContent = userName;
    } else if (userControls) {
      userControls.style.display = "none";
    }
  };

  // LINK DE MERCADO PAGO (Fallback / Legacy)
  const MP_LINK = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190eafba9930b25";

  // ELEMENTOS DEL MODAL PAGO
  const overlayPayment = document.getElementById("overlayPayment");
  const btnCerrarPayment = document.getElementById("cerrarPayment");

  // INICIALIZAR UI DE USUARIO
  updateUserUI();

  // LOGOUT LOGIC
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("authToken");
      updateUserUI();
      showToast("Sesión cerrada correctamente.");
    });
  }

  // LÓGICA DE SUSCRIPCIÓN
  if (btnSubscribe && overlayLogin && btnCerrarLogin && loginForm) {
    btnSubscribe.addEventListener("click", (e) => {
      e.preventDefault();

      // Verificar si el usuario está logueado (Mock)
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

      if (isLoggedIn) {
        // Si está logueado, mostrar modal de pago
        if (overlayPayment) {
          overlayPayment.classList.add("active");
        } else {
          window.location.href = MP_LINK;
        }
      } else {
        // Si no, mostrar modal de login
        overlayLogin.classList.add("active");
      }
    });

    btnCerrarLogin.addEventListener("click", () => {
      overlayLogin.classList.remove("active");
    });

    // Manejo del Login
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (email && password) {
        try {
          const response = await fetch('https://invasioncrypto-api.vercel.app/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (response.ok) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            if (data.name) localStorage.setItem("userName", data.name);
            if (data.token) localStorage.setItem("authToken", data.token);

            updateUserUI();

            // Cerrar modal y mostrar pago
            overlayLogin.classList.remove("active");
            showToast("Login exitoso.");
            if (overlayPayment) {
              overlayPayment.classList.add("active");
            } else {
              window.location.href = MP_LINK;
            }
          } else {
            showToast(data.message || "Error al iniciar sesión. Verificá tus datos.");
          }
        } catch (error) {
          console.error("Error:", error);
          showToast("Hubo un problema con la conexión.");
        }
      } else {
        showToast("Por favor completá todos los campos.");
      }
    });

    // Cerrar al hacer click fuera del contenido
    overlayLogin.addEventListener("click", (e) => {
      if (e.target === overlayLogin) {
        overlayLogin.classList.remove("active");
      }
    });

    // LÓGICA MODAL PAGO
    if (btnCerrarPayment && overlayPayment) {
      btnCerrarPayment.addEventListener("click", () => {
        overlayPayment.classList.remove("active");
      });

      overlayPayment.addEventListener("click", (e) => {
        if (e.target === overlayPayment) {
          overlayPayment.classList.remove("active");
        }
      });
    }
  }

  // ELEMENTOS DEL MODAL REGISTER
  const overlayRegister = document.getElementById("overlayRegister");
  const registerForm = document.getElementById("registerForm");
  const linkToRegister = document.getElementById("linkToRegister");
  const linkToLogin = document.getElementById("linkToLogin");
  const btnCerrarRegister = document.getElementById("cerrarRegister");

  // SWITCH MODALS
  if (linkToRegister && overlayLogin && overlayRegister) {
    linkToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      overlayLogin.classList.remove("active");
      overlayRegister.classList.add("active");
    });
  }

  if (linkToLogin && overlayLogin && overlayRegister) {
    linkToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      overlayRegister.classList.remove("active");
      overlayLogin.classList.add("active");
    });
  }

  // CLOSE REGISTER MODAL
  if (btnCerrarRegister && overlayRegister) {
    btnCerrarRegister.addEventListener("click", () => {
      overlayRegister.classList.remove("active");
    });

    // Close on click outside
    overlayRegister.addEventListener("click", (e) => {
      if (e.target === overlayRegister) {
        overlayRegister.classList.remove("active");
      }
    });
  }

  // REGISTER LOGIC
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;

      if (name && email && password) {
        try {
          const response = await fetch('https://invasioncrypto-api.vercel.app/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
          });

          const data = await response.json();

          if (response.ok) {
            showToast("Registro exitoso. Iniciando sesión...");

            // Auto login
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userName", name);

            updateUserUI();

            overlayRegister.classList.remove("active");
            if (overlayPayment) {
              overlayPayment.classList.add("active");
            } else {
              window.location.href = MP_LINK;
            }
          } else {
            showToast(data.message || "Error al registrarse. Intentalo de nuevo.");
          }
        } catch (error) {
          console.error("Error:", error);
          showToast("Hubo un problema con la conexión.");
        }
      } else {
        showToast("Por favor completá todos los campos.");
      }
    });
  }

  // ELEMENTOS DEL MODAL CARRITO (LEGACY - Mantenido por si se revierte)
  const overlay = document.getElementById("overlayCarrito");
  const btnAbrir = document.getElementById("btnCarrito");
  const btnCerrar = document.getElementById("cerrarCarrito");
  const btnComprarModal = document.getElementById("btnComprar");

  // LÓGICA DEL MODAL CARRITO
  if (btnAbrir && overlay && btnCerrar && btnComprarModal) {
    btnAbrir.addEventListener("click", (e) => {
      e.preventDefault();
      overlay.classList.add("active");

      // Evento GA4 (add_to_cart)
      if (typeof gtag === "function") {
        gtag("event", "add_to_cart", {
          currency: "ARS",
          value: 29000,
          items: [{ item_id: "crypto_plus", item_name: "Crypto+", quantity: 1 }]
        });
      }
    });

    btnCerrar.addEventListener("click", () => {
      overlay.classList.remove("active");
    });

    btnComprarModal.addEventListener("click", () => {
      // Evento GA4 (purchase)
      if (typeof gtag === "function") {
        gtag("event", "purchase", {
          transaction_id: "T" + Date.now(),
          currency: "ARS",
          value: 29000,
          items: [{ item_id: "crypto_plus", item_name: "Crypto+", quantity: 1 }]
        });
      }

      if (overlayPayment) {
        overlayPayment.classList.add("active");
      } else {
        window.location.href = MP_LINK;
      }
    });

    // Cerrar al hacer click fuera del contenido
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("active");
      }
    });
  }


  // LÓGICA DE LA PÁGINA DEL CARRITO (cart.html)
  const contenedor = document.getElementById('cart-container');
  if (contenedor) {
    // Esta lógica parece ser para cuando se usaba localStorage. 
    // Si el usuario quiere mantener la funcionalidad de cart.html, la dejamos.
    // Aunque con el modal, el flujo cambia. Pero por seguridad mantenemos esto.

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

      // Finalizar compra en cart.html
      const btnComprarCart = document.querySelector('.product-buy');
      if (btnComprarCart) {
        btnComprarCart.addEventListener('click', () => {
          if (typeof gtag === "function") {
            gtag("event", "purchase", {
              transaction_id: "T" + Date.now(),
              currency: "ARS",
              value: 26400,
              items: [{ item_id: "crypto_plus", item_name: "Crypto+", quantity: 1 }]
            });
          }
          window.location.href = MP_LINK;
          showToast('¡Serás redirigido a Mercado Pago!.');
        });
      }
    } else {
      contenedor.innerHTML = '<p class="hero-p-secondary">¡Tu carrito está <span style="font-weight: bolder;">vacío</span>, hacé click en "AGREGAR AL CARRITO" dentro de la sección <a href="crypto_plus.html" style=color: #9933CC;>Crypto+</a> para <span style="font-weight: bolder;">llenarlo</span>!</p>';
    }
  }
});


// SWIPER JS
if (typeof Swiper !== 'undefined') {
  const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

// TOAST NOTIFICATION FUNCTION
function showToast(message, duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger reflow
  void toast.offsetWidth;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300); // Wait for transition
  }, duration);
}
