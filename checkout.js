// SDK de Mercado Pago - IMPORTANTE: Reemplazar con tu PUBLIC_KEY real
// const mp = new MercadoPago('TEST-12345678-1234-1234-1234-123456789012');

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('checkoutForm');
    const btnPagar = document.getElementById('btnPagar');
    const mensajeDiv = document.getElementById('mensaje');

    // Validación del formulario
    function validarFormulario() {
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const dni = document.getElementById('dni').value.trim();
        const pais = document.getElementById('pais').value;
        const provincia = document.getElementById('provincia').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();
        const aceptoTerminos = document.getElementById('aceptoTerminos').checked;

        // Validar campos obligatorios
        if (!nombre || !apellido || !email || !telefono || !dni || !pais || !provincia || !ciudad) {
            mostrarMensaje('Por favor, completa todos los campos obligatorios marcados con *.', 'error');
            return false;
        }

        // Validar términos y condiciones
        if (!aceptoTerminos) {
            mostrarMensaje('Debes aceptar los términos y condiciones para continuar.', 'error');
            return false;
        }

        // Validar email
        if (!validarEmail(email)) {
            mostrarMensaje('Por favor, ingresa un email válido.', 'error');
            return false;
        }

        // Validar teléfono
        if (!validarTelefono(telefono)) {
            mostrarMensaje('Por favor, ingresa un teléfono válido.', 'error');
            return false;
        }

        // Validar DNI
        if (!validarDNI(dni)) {
            mostrarMensaje('Por favor, ingresa un DNI válido (solo números).', 'error');
            return false;
        }

        return true;
    }

    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validarTelefono(telefono) {
        // Permite formato internacional: +54 9 351 123 4567
        const re = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return re.test(telefono);
    }

    function validarDNI(dni) {
        // Solo números, entre 7 y 8 dígitos
        const re = /^[0-9]{7,8}$/;
        return re.test(dni);
    }

    function mostrarMensaje(mensaje, tipo) {
        mensajeDiv.innerHTML = `<div class="${tipo === 'error' ? 'error-message' : 'success-message'}">${mensaje}</div>`;
        mensajeDiv.scrollIntoView({ behavior: 'smooth' });
    }

    function limpiarMensaje() {
        mensajeDiv.innerHTML = '';
    }

    // Manejo del envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }

        btnPagar.disabled = true;
        btnPagar.textContent = '⏳ Procesando...';
        limpiarMensaje();

        try {
            // Recopilar datos del formulario
            const formData = new FormData(form);
            const datosCliente = Object.fromEntries(formData.entries());
            
            // Agregar información del producto y metadatos
            datosCliente.producto = 'CRYPTO+ - Chat de Alertas';
            datosCliente.precio = 26400;
            datosCliente.iva = 5544;
            datosCliente.total = 31944;
            datosCliente.fecha = new Date().toISOString();
            datosCliente.estado = 'pendiente';
            datosCliente.origen = 'checkout_web';
            datosCliente.tipo = 'suscripcion_mensual';

            // Guardar datos en localStorage temporalmente
            localStorage.setItem('datosCliente', JSON.stringify(datosCliente));

            // Enviar datos por email
            await enviarDatosPorEmail(datosCliente);

            // Evento GA4 para inicio de checkout
            if (typeof gtag === "function") {
                gtag("event", "begin_checkout", {
                    currency: "ARS",
                    value: 31944,
                    items: [{ 
                        item_id: "crypto_plus", 
                        item_name: "Crypto+ - Chat de Alertas", 
                        quantity: 1,
                        price: 31944
                    }]
                });
            }

            // Redirigir directamente a Mercado Pago
            window.location.href = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190eafba9930b25";

        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.', 'error');
            btnPagar.disabled = false;
            btnPagar.textContent = '💳 Proceder al Pago';
        }
    });

    // Función para enviar datos por email
    async function enviarDatosPorEmail(datosCliente) {
        try {
            // En un entorno real, aquí enviarías los datos a tu servidor
            // Por ahora, simulamos el envío
            
            console.log('Enviando datos del cliente:', datosCliente);
            
            // Simular envío de email
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Llamada a tu servidor para enviar email
            const response = await fetch('/enviar-email.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosCliente)
            });
            
            if (!response.ok) {
                console.warn('Advertencia: No se pudieron enviar los datos por email');
            }
            
            console.log('Datos enviados correctamente');
            
        } catch (error) {
            console.error('Error enviando datos:', error);
            // No bloqueamos el flujo si falla el email
        }
    }

    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
                this.style.background = '#fff5f5';
            } else {
                this.style.borderColor = '#e0e0e0';
                this.style.background = '#fafafa';
            }
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(220, 53, 69)') {
                this.style.borderColor = '#e0e0e0';
                this.style.background = '#fafafa';
            }
        });
    });

    // Validación específica para DNI
    const dniInput = document.getElementById('dni');
    dniInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 8) {
            this.value = this.value.slice(0, 8);
        }
    });

    // Validación específica para teléfono
    const telefonoInput = document.getElementById('telefono');
    telefonoInput.addEventListener('input', function() {
        // Permite solo números, espacios, guiones, paréntesis y el símbolo +
        this.value = this.value.replace(/[^0-9\s\-\(\)\+]/g, '');
    });

    // Auto-completar provincia para Argentina
    const paisSelect = document.getElementById('pais');
    const provinciaInput = document.getElementById('provincia');
    
    paisSelect.addEventListener('change', function() {
        if (this.value === 'AR') {
            provinciaInput.placeholder = 'Ej: Córdoba, Buenos Aires, Mendoza...';
        } else {
            provinciaInput.placeholder = 'Provincia o Estado';
        }
    });

    // Mostrar progreso del formulario
    function mostrarProgreso() {
        const camposObligatorios = form.querySelectorAll('[required]');
        const camposCompletados = Array.from(camposObligatorios).filter(campo => {
            if (campo.type === 'checkbox') {
                return campo.checked;
            }
            return campo.value.trim() !== '';
        }).length;
        
        const porcentaje = Math.round((camposCompletados / camposObligatorios.length) * 100);
        
        // Actualizar texto del botón con progreso
        if (porcentaje < 100) {
            btnPagar.textContent = `💳 Completar Formulario (${porcentaje}%)`;
        } else {
            btnPagar.textContent = '💳 Proceder al Pago';
        }
    }

    // Escuchar cambios en campos obligatorios
    const camposObligatorios = form.querySelectorAll('[required]');
    camposObligatorios.forEach(campo => {
        campo.addEventListener('input', mostrarProgreso);
        campo.addEventListener('change', mostrarProgreso);
    });

    // Inicializar progreso
    mostrarProgreso();
});
