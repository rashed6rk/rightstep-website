<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();
$email = strtolower(trim($input['email'] ?? ''));

if (!$email) {
    jsonError('Email is required');
}

try {
    $db = getDB();

    $stmt = $db->prepare("SELECT id, name, email FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    // Always return success to prevent email enumeration
    if ($user) {
        $otp = generateOTP();
        $expiresAt = date('Y-m-d H:i:s', time() + $GLOBALS['OTP_EXPIRY_MINUTES'] * 60);

        $db->prepare("DELETE FROM otp_codes WHERE email = :email AND purpose = 'reset' AND used = 0")
           ->execute([':email' => $email]);

        $stmt = $db->prepare("INSERT INTO otp_codes (email, code, purpose, expires_at) VALUES (:email, :code, 'reset', :expires)");
        $stmt->execute([
            ':email' => $email,
            ':code' => password_hash($otp, PASSWORD_BCRYPT),
            ':expires' => $expiresAt,
        ]);

        sendOTPEmail($email, $otp, $user['name']);
    }

    jsonResponse([
        'success' => true,
        'message' => 'If an account exists, a reset code has been sent.',
    ]);
} catch (PDOException $e) {
    jsonError('Server error', 500);
}
