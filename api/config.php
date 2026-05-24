<?php
// ================================================
// SECURITY FUNCTIONS
// ================================================

function sanitizeInput(string $input): string {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function validateEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validateRequired(string $value): bool {
    return !empty(trim($value));
}

function getDataFile(string $filePath): array {
    if (!file_exists($filePath)) {
        file_put_contents($filePath, json_encode([]));
        return [];
    }
    $content = file_get_contents($filePath);
    $data = json_decode($content, true);
    return $data ?: [];
}

function saveDataFile(string $filePath, array $data): bool {
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    file_put_contents($filePath, $json, LOCK_EX);
    return true;
}

function sendJSON(array $data): void {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function sendError(string $message, int $code = 400): void {
    http_response_code($code);
    sendJSON(['error' => $message]);
}

function sendSuccess(string $message, array $data = []): void {
    sendJSON(['success' => $message, 'data' => $data]);
}

// ================================================
// PREVENT DIRECT ACCESS
// ================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Invalid request method', 405);
}
?>
