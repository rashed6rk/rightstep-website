<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();
$email = strtolower(trim($input['email'] ?? ''));
$purpose = $input['purpose'] ?? 'login';

if (!$email) {
    jsonError('Email is required');
}

if (!in_array($purpose, ['login', 'signup', 'reset'])) {
    jsonError('Invalid purpose');
}

try {
    $db = getDB();

    // Rate limit: max 3 OTPs per email per 10 minutes
    $stmt = $db->prepare("
        SELECT COUNT(*) as cnt FROM otp_codes
        WHERE email = :email AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
    ");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()['cnt'] >= 3) {
        jsonError('Too many OTP requests. Please wait a few minutes.', 429);
    }

    $stmt = $db->prepare("SELECT id, name FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(['success' => true, 'message' => 'If an account exists, a new code has been sent.']);
    }

    $db->prepare("DELETE FROM otp_codes WHERE email = :email AND purpose = :purpose AND used = 0")
       ->execute([':email' => $email, ':purpose' => $purpose]);

    $otp = generateOTP();
    $expiresAt = date('Y-m-d H:i:s', time() + $GLOBALS['OTP_EXPIRY_MINUTES'] * 60);

    $stmt = $db->prepare("INSERT INTO otp_codes (email, code, purpose, expires_at) VALUES (:email, :code, :purpose, :expires)");
    $stmt->execute([
        ':email' => $email,
        ':code' => password_hash($otp, PASSWORD_BCRYPT),
        ':purpose' => $purpose,
        ':expires' => $expiresAt,
    ]);

    $otpId = $db->lastInsertId();
    $sent = sendOTPEmail($email, $otp, $user['name']);

    jsonResponse([
        'success' => true,
        'message' => 'New OTP sent',
        'otpId' => (int)$otpId,
        'emailSent' => $sent,
    ]);
} catch (PDOException $e) {
    jsonError('Server error', 500);
}
