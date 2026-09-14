<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (!$email || !$password) {
    jsonError('Email and password are required');
}

$email = strtolower($email);

try {
    $db = getDB();

    $stmt = $db->prepare("SELECT id, name, email, password_hash, role, email_verified FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !verifyPassword($password, $user['password_hash'])) {
        jsonError('Invalid email or password', 401);
    }

    $otp = generateOTP();
    $expiresAt = date('Y-m-d H:i:s', time() + $GLOBALS['OTP_EXPIRY_MINUTES'] * 60);

    $db->prepare("DELETE FROM otp_codes WHERE email = :email AND purpose = 'login' AND used = 0")
       ->execute([':email' => $email]);

    $stmt = $db->prepare("INSERT INTO otp_codes (email, code, purpose, expires_at) VALUES (:email, :code, 'login', :expires)");
    $stmt->execute([
        ':email' => $email,
        ':code' => password_hash($otp, PASSWORD_BCRYPT),
        ':expires' => $expiresAt,
    ]);

    $otpId = $db->lastInsertId();

    $sent = sendOTPEmail($email, $otp, $user['name']);

    jsonResponse([
        'success' => true,
        'message' => 'OTP sent to your email',
        'otpId' => (int)$otpId,
        'email' => $email,
        'emailSent' => $sent,
    ]);
} catch (PDOException $e) {
    jsonError('Server error', 500);
}
