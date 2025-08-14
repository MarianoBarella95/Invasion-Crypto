<?php
// Configuración de email
$tu_email = 'tu-email@invasioncrypto.com'; // Cambiar por tu email real
$asunto = 'Nuevo Cliente CRYPTO+ - Formulario Completado';

// Verificar si es una petición POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Obtener datos del formulario
    $input = file_get_contents('php://input');
    $datos = json_decode($input, true);
    
    if ($datos) {
        // Crear mensaje del email
        $mensaje = "NUEVO CLIENTE CRYPTO+ - FORMULARIO COMPLETADO\n\n";
        $mensaje .= "DATOS PERSONALES:\n";
        $mensaje .= "Nombre: " . $datos['nombre'] . " " . $datos['apellido'] . "\n";
        $mensaje .= "Email: " . $datos['email'] . "\n";
        $mensaje .= "Teléfono: " . $datos['telefono'] . "\n";
        $mensaje .= "DNI: " . $datos['dni'] . "\n";
        $mensaje .= "Fecha de Nacimiento: " . ($datos['fechaNacimiento'] ?? 'No especificada') . "\n\n";
        
        $mensaje .= "DIRECCIÓN:\n";
        $mensaje .= "País: " . $datos['pais'] . "\n";
        $mensaje .= "Provincia: " . $datos['provincia'] . "\n";
        $mensaje .= "Ciudad: " . $datos['ciudad'] . "\n";
        $mensaje .= "Código Postal: " . ($datos['codigoPostal'] ?? 'No especificado') . "\n";
        $mensaje .= "Dirección: " . ($datos['direccion'] ?? 'No especificada') . "\n\n";
        
        $mensaje .= "INFORMACIÓN ADICIONAL:\n";
        $mensaje .= "Comentarios: " . ($datos['comentarios'] ?? 'Ninguno') . "\n";
        $mensaje .= "Cómo nos conoció: " . ($datos['comoConociste'] ?? 'No especificado') . "\n";
        $mensaje .= "Acepta newsletter: " . ($datos['aceptoNewsletter'] ? 'Sí' : 'No') . "\n\n";
        
        $mensaje .= "DETALLES DEL PRODUCTO:\n";
        $mensaje .= "Producto: " . $datos['producto'] . "\n";
        $mensaje .= "Precio: $" . $datos['precio'] . " ARS\n";
        $mensaje .= "IVA: $" . $datos['iva'] . " ARS\n";
        $mensaje .= "Total: $" . $datos['total'] . " ARS\n";
        $mensaje .= "Tipo: " . $datos['tipo'] . "\n";
        $mensaje .= "Fecha: " . $datos['fecha'] . "\n";
        $mensaje .= "Estado: " . $datos['estado'] . "\n\n";
        
        $mensaje .= "ENLACE DE MERCADO PAGO:\n";
        $mensaje .= "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808490c3cf9e0190eafba9930b25\n\n";
        
        $mensaje .= "---\n";
        $mensaje .= "Este email fue generado automáticamente por el formulario de checkout.\n";
        $mensaje .= "El cliente ha sido redirigido a Mercado Pago para completar el pago.";
        
        // Headers del email
        $headers = "From: " . $datos['email'] . "\r\n";
        $headers .= "Reply-To: " . $datos['email'] . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // Enviar email
        if (mail($tu_email, $asunto, $mensaje, $headers)) {
            // Respuesta exitosa
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Datos enviados correctamente']);
        } else {
            // Error al enviar email
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al enviar email']);
        }
        
    } else {
        // Error en los datos
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    }
    
} else {
    // Método no permitido
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
