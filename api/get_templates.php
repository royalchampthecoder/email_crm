<?php
require_once '../api/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$file = '../data/templates.json';
$data = getDataFile($file);
sendJSON($data);