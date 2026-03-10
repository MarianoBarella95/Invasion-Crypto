// CONFIGURACIÓN API
var API_URL = "https://invasioncrypto-api.vercel.app";

// FUNCIÓN AUXILIAR PARA LLAMADAS A LA API
async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
}

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
    const userName = localStorage.getItem("userName");

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
  }

  // Manejo del Login Consolidado
  const handleLogin = async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    if (!emailInput || !passwordInput) return;

    const email = emailInput.value;
    const password = passwordInput.value;
    
    // Limpiar restos de sesiones previas para evitar conflictos de roles
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("authToken");

    if (email && password) {
      try {
        const response = await apiFetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        console.log("LOGIN RESPONSE DATA:", data);

        if (response.ok) {
          localStorage.setItem("isLoggedIn", "true");
          const token = data.token || data.accessToken || data.jwt;
          localStorage.setItem("authToken", token);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userName", data.user ? data.user.name : "Usuario");

          // Detectar rol de forma ultra-robusta buscando en todo el objeto de respuesta
          let roleRaw = "user";

          function searchRole(obj) {
            if (!obj || typeof obj !== "object") return null;
            
            // 1. Buscar flags booleanos de admin
            if (obj.isAdmin === true || obj.isAdmin === "true" || obj.is_admin === true || obj.is_admin === "true") return "admin";
            
            // 2. Buscar campos de rol/rol_id
            const roleFields = ["role", "rol", "tipo", "role_id", "rol_id", "status", "roles", "user_role", "permission_level"];
            for (let field of roleFields) {
              if (obj[field]) {
                const val = Array.isArray(obj[field]) ? String(obj[field][0]).toLowerCase() : String(obj[field]).toLowerCase();
                if (val === "admin" || val === "1" || val === "administrador" || val === "superadmin") return "admin";
                if (val === "user" || val === "usuario" || val === "cliente" || val === "0") return "user";
              }
            }

            // 3. Búsqueda recursiva en sub-objetos (como data.user o data.data)
            for (let key in obj) {
              if (typeof obj[key] === "object") {
                const found = searchRole(obj[key]);
                if (found) return found;
              }
            }
            return null;
          }

          roleRaw = searchRole(data) || "user";
          const role = roleRaw.toLowerCase();

          localStorage.setItem("userRole", role);
          localStorage.setItem("userStatus", data.user ? (data.user.estado || data.user.status) : "denegado");
          
          showToast("Login exitoso.");
          setTimeout(() => {
            if (role === "admin") {
              window.location.href = "admin_panel.html";
            } else {
              window.location.href = "panel_usuario.html";
            }
          }, 1000);
        } else {
          showToast(data.message || "Email o contraseña incorrectos.");
        }
      } catch (error) {
        console.error("Error Login:", error);
        showToast("Error de conexión con el servidor.");
      }
    } else {
      showToast("Por favor completá todos los campos.");
    }
  };

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);

    // Cerrar al hacer click fuera del contenido
    if (overlayLogin) {
      overlayLogin.addEventListener("click", (e) => {
        if (e.target === overlayLogin) {
          overlayLogin.classList.remove("active");
        }
      });
    }

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

  // ELEMENTOS DEL MODAL FORGOT PASSWORD
  const overlayForgotPassword = document.getElementById("overlayForgotPassword");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  const linkToForgotPassword = document.getElementById("linkToForgotPassword");
  const linkBackToLogin = document.getElementById("linkBackToLogin");
  const btnCerrarForgotPassword = document.getElementById("cerrarForgotPassword");

  // SWITCH MODALS - FORGOT PASSWORD
  if (linkToForgotPassword && overlayLogin && overlayForgotPassword) {
    linkToForgotPassword.addEventListener("click", (e) => {
      e.preventDefault();
      overlayLogin.classList.remove("active");
      overlayForgotPassword.classList.add("active");
    });
  }

  if (linkBackToLogin && overlayLogin && overlayForgotPassword) {
    linkBackToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      overlayForgotPassword.classList.remove("active");
      overlayLogin.classList.add("active");
    });
  }

  // CLOSE FORGOT PASSWORD MODAL
  if (btnCerrarForgotPassword && overlayForgotPassword) {
    btnCerrarForgotPassword.addEventListener("click", () => {
      overlayForgotPassword.classList.remove("active");
    });

    // Close on click outside
    overlayForgotPassword.addEventListener("click", (e) => {
      if (e.target === overlayForgotPassword) {
        overlayForgotPassword.classList.remove("active");
      }
    });
  }

  // FORGOT PASSWORD LOGIC
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value;

      if (email) {
        try {
          const response = await apiFetch("/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email })
          });

          const data = await response.json();

          if (response.ok) {
            showToast("Se envió un enlace de recuperación a tu email.");
            forgotPasswordForm.reset();
            overlayForgotPassword.classList.remove("active");
            overlayLogin.classList.add("active");
          } else {
            showToast(data.message || "No pudimos encontrar una cuenta con ese email.");
          }
        } catch (error) {
          console.error("Error:", error);
          showToast("Hubo un problema con la conexión.");
        }
      } else {
        showToast("Por favor ingresá tu email.");
      }
    });
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
    if (overlayRegister) {
      overlayRegister.addEventListener("click", (e) => {
        if (e.target === overlayRegister) {
          overlayRegister.classList.remove("active");
        }
      });
    }
  }

  // REGISTER LOGIC
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;

      const confirm = document.getElementById("regConfirm") ? document.getElementById("regConfirm").value : "";

      if (confirm && password !== confirm) {
        showToast("Las contraseñas no coinciden.");
        return;
      }

      if (name && email && password) {
        try {
          const response = await apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password })
          });

          const data = await response.json();

          if (response.ok) {
            showToast("Registro exitoso. Serás redirigido al login.");
            setTimeout(() => {
              // Redirigir al login (en auth.html o donde se encuentre el form)
              if (window.location.pathname.includes("auth.html")) {
                  if (typeof switchTab === 'function') {
                    switchTab('login');
                  } else {
                    overlayRegister.classList.remove("active");
                    overlayLogin.classList.add("active");
                  }
              } else {
                  window.location.href = "auth.html?mode=login";
              }
            }, 2000);
          } else {
            showToast(data.message || "Error al registrarse.");
          }
        } catch (error) {
          console.error("Error Register:", error);
          showToast("Error de conexión con el servidor.");
        }
      } else {
        showToast("Por favor completá todos los campos.");
      }
    });
  }

  // NOTA: Se ha removido la inicialización de datos de prueba local (Mock) para favorecer la API real.

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

// ANIMACIÓN DE LOGOS FLOTANTES (GSAP)
function initLogoAnimation() {
  const banners = document.querySelectorAll('.banner, .banner-secondary');
  if (banners.length === 0 || typeof gsap === 'undefined') return;

  banners.forEach((banner) => {
    const logoCount = 12;
    for (let i = 0; i < logoCount; i++) {
        const logo = document.createElement('div');
        logo.className = 'logo-floating';
        logo.innerHTML = `<svg viewBox="0 0 100 100" fill="white" style="width: 100%; height: 100%; opacity: 0.15;">
            <path d="M20,20 L50,80 L80,20 L70,20 L50,60 L30,20 Z" />
        </svg>`;
        
        logo.style.position = 'absolute';
        logo.style.width = (Math.random() * 40 + 30) + 'px';
        logo.style.height = logo.style.width;
        logo.style.left = Math.random() * 90 + '%';
        logo.style.top = Math.random() * 90 + '%';
        logo.style.pointerEvents = 'none';
        logo.style.zIndex = '1';

        banner.appendChild(logo);

        gsap.to(logo, {
            x: 'random(-150, 150)',
            y: 'random(-150, 150)',
            rotation: 'random(-180, 180)',
            duration: 'random(8, 15)',
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
  });
}

// TOAST NOTIFICATION FUNCTION (GLOBAL)
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

