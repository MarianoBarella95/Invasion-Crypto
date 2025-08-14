<?php
// Configuración de Mercado Pago
define('MP_ACCESS_TOKEN', 'TEST-1234567890123456789012345678901234567890'); // Reemplazar con tu ACCESS_TOKEN real
define('MP_PUBLIC_KEY', 'TEST-12345678-1234-1234-1234-123456789012'); // Reemplazar con tu PUBLIC_KEY real

// Configuración de base de datos (opcional)
define('DB_HOST', 'localhost');
define('DB_NAME', 'invasion_crypto');
define('DB_USER', 'usuario');
define('DB_PASS', 'password');

// Configuración de email
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'tu-email@gmail.com');
define('SMTP_PASS', 'tu-password-app');

// URLs de retorno
define('SUCCESS_URL', 'https://invasioncrypto.com/success.html');
define('FAILURE_URL', 'https://invasioncrypto.com/failure.html');
define('PENDING_URL', 'https://invasioncrypto.com/pending.html');

// Configuración del producto
define('PRODUCT_NAME', 'CRYPTO+');
define('PRODUCT_PRICE', 26400);
define('PRODUCT_IVA', 5544);
define('PRODUCT_TOTAL', 31944);
?>
