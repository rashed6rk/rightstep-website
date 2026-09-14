<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();
$otpId = (int)($input['otpId'] ?? 0);
$code = trim($input['code'] ?? '');
$email = strtolower(trim($input['email'] ?? ''));

if (!$otpId || !$code || !$email) {
    jsonError('OTP ID, code, and email are required');
}

try {
    $db = getDB();

    $stmt = $db->prepare("
        SELECT id, email, code, purpose, attempts, expires_at, used
        FROM otp_codes
        WHERE id = :id AND email = :email AND used = 0
        LIMIT 1
    ");
    $stmt->execute([':id' => $otpId, ':email' => $email]);
    $otp = $stmt->fetch();

    if (!$otp) {
        jsonError('Invalid or expired OTP', 401);
    }

    if (strtotime($otp['expires_at']) < time()) {
        jsonError('OTP has expired. Please request a new one.', 401);
    }

    if ($otp['attempts'] >= 5) {
        jsonError('Too many attempts. Please request a new OTP.', 429);
    }

    $db->prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = :id")
       ->execute([':id' => $otpId]);

    if (!password_verify($code, $otp['code'])) {
        jsonError('Incorrect OTP code', 401);
    }

    $db->prepare("UPDATE otp_codes SET used = 1 WHERE id = :id")
       ->execute([':id' => $otpId]);

    $stmt = $db->prepare("SELECT id, name, email, role, email_verified FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonError('User not found', 404);
    }

    if ($otp['purpose'] === 'signup') {
        $db->prepare("UPDATE users SET email_verified = 1 WHERE id = :id")
           ->execute([':id' => $user['id']]);
        $user['email_verified'] = 1;
    }

    $token = createJWT([
        'sub' => (int)$user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'name' => $user['name'],
    ]);

    $tokenHash = hash('sha256', $token);
    $expiresAt = date('Y-m-d H:i:s', time() + 86400 * 7);

    $db->prepare("INSERT INTO sessions (user_id, token_hash, ip_address, user_agent, expires_at) VALUES (:uid, :hash, :ip, :ua, :exp)")
       ->execute([
           ':uid' => $user['id'],
           ':hash' => $tokenHash,
           ':ip' => $_SERVER['REMOTE_ADDR'] ?? '',
           ':ua' => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 512),
           ':exp' => $expiresAt,
       ]);

    jsonResponse([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => (int)$user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ],
    ]);
} catch (PDOException $e) {
    jsonError('Server error', 500);
}
