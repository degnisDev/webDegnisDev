<?php
// Configuración de seguridad
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Solo permitir método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Obtener y validar datos del formulario
$nombre = trim($_POST['nombre'] ?? '');
$email = trim($_POST['email'] ?? '');
$motivo = trim($_POST['motivo'] ?? '');

// Validaciones básicas
if (empty($nombre) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Nombre y email son obligatorios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email no válido']);
    exit;
}

// Configuración del correo
$para = 'web@degnisdev.com, degnisdev@gmail.com';
$asunto = 'Solicitud de Hoja de Vida - ' . $nombre;

// Crear el mensaje
$mensaje = "
<html>
<head>
    <title>Solicitud de Hoja de Vida</title>
</head>
<body>
    <h2>Nueva solicitud de Hoja de Vida</h2>
    <p><strong>Nombre:</strong> " . htmlspecialchars($nombre) . "</p>
    <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
    <p><strong>Mensaje:</strong></p>
    <div style='background-color: #f4f4f4; padding: 15px; border-left: 4px solid #007bff;'>
        " . nl2br(htmlspecialchars($motivo)) . "
    </div>
    <hr>
    <p><small>Este correo fue enviado desde tu formulario web</small></p>
</body>
</html>
";

// Configurar headers del email
$headers = array(
    'MIME-Version' => '1.0',
    'Content-type' => 'text/html; charset=UTF-8',
    'From' => 'noreply@degnisdev.com', // CAMBIA POR TU DOMINIO
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion()
);

// Convertir headers a string
$headers_string = '';
foreach($headers as $key => $value) {
    $headers_string .= $key . ': ' . $value . "\r\n";
}

// Enviar el correo
try {
    if (mail($para, $asunto, $mensaje, $headers_string)) {
        echo json_encode([
            'success' => true, 
            'message' => '¡Solicitud enviada correctamente! Te contactaré pronto.'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'message' => 'Error al enviar el correo. Intenta nuevamente.'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => 'Error del servidor. Intenta más tarde.'
    ]);
}
?>