<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Method not allowed', 405);
}

$payload = requireAuth();

try {
    $db = getDB();
    $stmt = $db->prepare("SELECT id, name, email, phone, role, email_verified, created_at FROM users WHERE id = :id LIMIT 1");
    $stmt->execute([':id' => $payload['sub']]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonError('User not found', 404);
    }

    jsonResponse([
        'user' => [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'role' => $user['role'],
            'emailVerified' => (bool)$user['email_verified'],
            'createdAt' => $user['created_at'],
        ],
    ]);
} catch (PDOException $e) {
    jsonError('Server error', 500);
}
