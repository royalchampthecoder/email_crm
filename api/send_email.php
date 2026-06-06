<?php

require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: application/json');

$configFile = __DIR__ . '/email_settings.json';

if (!file_exists($configFile)) {
    echo json_encode([
        'success' => false,
        'message' => 'Email settings not found'
    ]);
    exit;
}

$config = json_decode(
    file_get_contents($configFile),
    true
);

$provider = $config['active_provider'] ?? '';

if (empty($provider)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please configure email settings'
    ]);
    exit;
}

try {

    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->SMTPAuth = true;

    if ($provider === 'gmail') {

        $mail->Host = 'smtp.gmail.com';
        $mail->Port = 587;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        $mail->Username = $config['gmail']['email'];
        $mail->Password = $config['gmail']['password'];

        $fromEmail = $config['gmail']['email'];

    } elseif ($provider === 'outlook') {

        $mail->Host = 'smtp.office365.com';
        $mail->Port = 587;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        $mail->Username = $config['outlook']['email'];
        $mail->Password = $config['outlook']['password'];

        $fromEmail = $config['outlook']['email'];

    } else {

        echo json_encode([
            'success' => false,
            'message' => 'No email provider enabled'
        ]);
        exit;

    }

    $mail->setFrom($fromEmail);

    $mail->addAddress($_POST['to_email']);

    $mail->isHTML(true);

    $mail->Subject = $_POST['subject'] ?? '';

    // FULL HTML FORMAT PRESERVED
    $mail->Body = $_POST['body'] ?? '';

    $mail->send();

    echo json_encode([
        'success' => true
    ]);

} catch (Exception $e) {

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);

}