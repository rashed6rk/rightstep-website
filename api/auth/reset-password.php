<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();
$email = strtolower(trim($input['email'] ?? ''));
$code = trim($input['code'] ?? '');
$newPassword = $input['newPassword'] ?? '';

if (!$email || !$code || !$newPassword) {
    jsonError('Email, code, and new password are required');
}

if (strlen($newPassword) < 12) {
    jsonError('Password must be at least 12 characters');
}

try {
    $db = getDB();

    $stmt = $db->prepare("
        SELECT id, code, attempts, expires_at
        FROM otp_codes
        WHERE email = :email AND purpose = 'reset' AND used = 0
        ORDER BY created_at DESC LIMIT 1
    ");
    $stmt->execute([':email' => $email]);
    $otp = $stmt->fetch();

    if (!$otp) {
        jsonError('Invalid or expired reset code', 401);
    }

    if (strtotime($otp['expires_at']) < time()) {
        jsonError('Reset code has expired', 401);
    }

    if ($otp['attempts'] >= 5) {
        jsonError('Too many attempts', 429);
    }

    $db->prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = :id")
       ->execute([':id' => $otp['id']]);

    if (!password_verify($code, $otp['code'])) {
        jsonError('Incorrect reset code', 401);
    }

    $db->prepare("UPDATE otp_codes SET used = 1 WHERE id = :id")
       ->execute([':id' => $otp['id']]);

    $hash = hashPassword($newPassword);
    $stmt = $db->prepare("UPDATE users SET password_hash = :hash WHERE email = :email");
    $stmt->execute([':hash' => $hash, ':email' => $email]);

    // Invalidate all existing sessions
    $db->prepare("
        DELETE s FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE u.email = :email
    ")->execute([':email' => $email]);

    jsonResponse([
        'success' => true,
        'message' => 'Password reset successfully. Please login.',
    ]);
} catch (PDOException $e) {
    jsonError('Server error', 500);
}
