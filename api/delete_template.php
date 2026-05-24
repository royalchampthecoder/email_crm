<?php
require_once '../api/config.php';

$file = '../data/templates.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $index = isset($_POST['index']) ? (int)$_POST['index'] : -1;

    if ($index < 0) {
        sendError('Invalid index');
        exit;
    }

    $data = getDataFile($file);

    if (!isset($data[$index])) {
        sendError('Template not found', 404);
        exit;
    }

    unset($data[$index]);
    $data = array_values($data);

    if (saveDataFile($file, $data)) {
        sendSuccess('Template deleted successfully');
    } else {
        sendError('Failed to delete template', 500);
    }
}
?>