<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$payload = requireAuth();
$input = getJsonInput();

$currentPassword = $input['currentPassword'] ?? '';
$newPassword = $input['newPassword'] ?? '';

if ($currentPassword === '' || $newPassword === '') {
    jsonError('Both current and new password are required');
}

if (mb_strlen($newPassword) < 12) {
    jsonError('New password must be at least 12 characters');
}

try {
    $db = getDB();
    $userId = $payload['sub'];

    $stmt = $db->prepare("SELECT password_hash FROM users WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonError('User not found', 404);
    }

    if (!verifyPassword($currentPassword, $user['password_hash'])) {
        jsonError('Current password is incorrect');
    }

    $newHash = hashPassword($newPassword);
    $update = $db->prepare("UPDATE users SET password_hash = :hash, updated_at = NOW() WHERE id = :id");
    $update->execute([':hash' => $newHash, ':id' => $userId]);

    jsonResponse(['success' => true]);
} catch (PDOException $e) {
    jsonError('Server error', 500);
}
