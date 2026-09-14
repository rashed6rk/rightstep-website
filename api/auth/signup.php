<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$input = getJsonInput();
$name = trim($input['name'] ?? '');
$email = strtolower(trim($input['email'] ?? ''));
$password = $input['password'] ?? '';

if (!$name || !$email || !$password) {
    jsonError('Name, email, and password are required');
}

if (strlen($password) < 12) {
    jsonError('Password must be at least 12 characters');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('Invalid email address');
}

try {
    $db = getDB();

    $stmt = $db->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        jsonError('An account with this email already exists', 409);
    }

    $hash = hashPassword($password);
    $stmt = $db->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (:name, :email, :hash, 'client')");
    $stmt->execute([':name' => $name, ':email' => $email, ':hash' => $hash]);

    $otp = generateOTP();
    $expiresAt = date('Y-m-d H:i:s', time() + $GLOBALS['OTP_EXPIRY_MINUTES'] * 60);

    $stmt = $db->prepare("INSERT INTO otp_codes (email, code, purpose, expires_at) VALUES (:email, :code, 'signup', :expires)");
    $stmt->execute([
        ':email' => $email,
        ':code' => password_hash($otp, PASSWORD_BCRYPT),
        ':expires' => $expiresAt,
    ]);

    $otpId = $db->lastInsertId();

    $sent = sendOTPEmail($email, $otp, $name);

    jsonResponse([
        'success' => true,
        'message' => 'Account created. Please verify your email.',
        'otpId' => (int)$otpId,
        'email' => $email,
        'emailSent' => $sent,
    ], 201);
} catch (PDOException $e) {
    jsonError('Server error', 500);
}
