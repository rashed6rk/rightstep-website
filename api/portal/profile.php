<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$payload = requireAuth();
$input = getJsonInput();

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');

if ($name === '' || $email === '') {
    jsonError('Name and email are required');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('Invalid email address');
}

try {
    $db = getDB();
    $userId = $payload['sub'];

    $existing = $db->prepare("SELECT id FROM users WHERE email = :email AND id != :id LIMIT 1");
    $existing->execute([':email' => $email, ':id' => $userId]);
    if ($existing->fetch()) {
        jsonError('Email already in use');
    }

    $stmt = $db->prepare("UPDATE users SET name = :name, email = :email, phone = :phone, updated_at = NOW() WHERE id = :id");
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':id' => $userId,
    ]);

    $user = $db->prepare("SELECT id, name, email, phone, role FROM users WHERE id = :id LIMIT 1");
    $user->execute([':id' => $userId]);
    $row = $user->fetch();

    jsonResponse([
        'success' => true,
        'user' => [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'role' => $row['role'],
        ],
    ]);
} catch (PDOException $e) {
    jsonError('Server error', 500);
}
