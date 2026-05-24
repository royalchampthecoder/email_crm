<?php
require_once '../api/config.php';

$file = '../data/templates.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = getDataFile($file);
    sendJSON($data);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $index = isset($_POST['index']) ? trim($_POST['index']) : '';
    $title = isset($_POST['title']) ? sanitizeInput($_POST['title']) : '';
    $company = isset($_POST['company']) ? sanitizeInput($_POST['company']) : '';
    $position = isset($_POST['position']) ? sanitizeInput($_POST['position']) : '';
    $subject = isset($_POST['subject']) ? sanitizeInput($_POST['subject']) : '';
    $body = isset($_POST['body']) ? $_POST['body'] : '';

    // Validation
    if (!validateRequired($title) || !validateRequired($company) || 
        !validateRequired($position) || !validateRequired($subject)) {
        sendError('All fields are required');
        exit;
    }

    $data = getDataFile($file);

    $template = [
        'title' => $title,
        'company' => $company,
        'position' => $position,
        'subject' => $subject,
        'body' => $body,
        'date' => date('d-m-Y H:i A')
    ];

    if ($index !== '' && isset($data[(int)$index])) {
        $data[(int)$index] = $template;
    } else {
        $data[] = $template;
    }

    if (saveDataFile($file, $data)) {
        sendSuccess('Template saved successfully', ['template' => $template]);
    } else {
        sendError('Failed to save template', 500);
    }
}
?>