<?php
// enviar-formulario.php - Manejador de formulario de contacto
// Para servidor con PHP (Ionos)

// Configuración
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Configurar aquí tu email
$to_email = "info@rosaliacontrerasmoreira.com";
$from_email = "noreply@rosaliacontrerasmoreira.com"; // Debe ser de tu dominio para Ionos

// Obtener datos del formulario
$name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : '';
$message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

// Validación básica
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Por favor completa todos los campos']);
    exit;
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email no válido']);
    exit;
}

// Protección anti-spam básica (honeypot)
if (!empty($_POST['website'])) {
    // Campo honeypot rellenado = bot
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Mensaje enviado']); // Mentimos al bot
    exit;
}

// Construir el email
$email_subject = "Contacto web: " . $subject;
$email_body = "Has recibido un nuevo mensaje desde tu web.\n\n";
$email_body .= "Nombre: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Asunto: $subject\n\n";
$email_body .= "Mensaje:\n$message\n";

// Headers del email
$headers = "From: $from_email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Enviar email
$mail_sent = mail($to_email, $email_subject, $email_body, $headers);

if ($mail_sent) {
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'Mensaje enviado correctamente'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
    ]);
}
?>
