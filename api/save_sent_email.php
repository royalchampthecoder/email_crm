<?php
require_once '../api/config.php';

$file = '../data/sent_emails.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to_email = isset($_POST['to_email']) ? sanitizeInput($_POST['to_email']) : '';
    $title = isset($_POST['title']) ? sanitizeInput($_POST['title']) : '';
    $company = isset($_POST['company']) ? sanitizeInput($_POST['company']) : '';
    $position = isset($_POST['position']) ? sanitizeInput($_POST['position']) : '';
    $subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';

    // Validation
    if (!validateEmail($to_email)) {
        sendError('Invalid email address');
        exit;
    }
    if (!validateRequired($title) || !validateRequired($company) || 
        !validateRequired($position) || !validateRequired($subject)) {
        sendError('All fields are required');
        exit;
    }

    $data = getDataFile($file);

    $email = [
        'to_email' => $to_email,
        'title' => $title,
        'company' => $company,
        'position' => $position,
        'subject' => $subject,
        'status' => 'Sent',
        'date' => date('d-m-Y H:i A')
    ];

    $data[] = $email;

    if (saveDataFile($file, $data)) {
        sendSuccess('Email saved successfully', ['email' => $email]);
    } else {
        sendError('Failed to save email', 500);
    }
}
?>