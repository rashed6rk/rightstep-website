<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Load .env file if it exists (Hostinger shared hosting doesn't support env vars)
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($val);
    }
}

function env(string $key, string $default = ''): string {
    return $_ENV[$key] ?? getenv($key) ?: $default;
}

$DB_HOST = env('DB_HOST', 'localhost');
$DB_NAME = env('DB_NAME');
$DB_USER = env('DB_USER');
$DB_PASS = env('DB_PASS');

$JWT_SECRET = env('JWT_SECRET', 'CHANGE_ME_IN_PRODUCTION_' . md5(__DIR__));
$OTP_EXPIRY_MINUTES = 10;
$OTP_LENGTH = 6;

$SMTP_HOST = env('SMTP_HOST', 'smtp.hostinger.com');
$SMTP_PORT = (int) env('SMTP_PORT', '465');
$SMTP_USER = env('SMTP_USER', 'noreply@rightstepae.com');
$SMTP_PASS = env('SMTP_PASS');
$SMTP_FROM_NAME = 'Right Step Consultancy';

function getDB() {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS;
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
            $DB_USER,
            $DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    }
    return $pdo;
}

function jsonResponse(array $data, int $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $status = 400) {
    jsonResponse(['error' => $message], $status);
}

function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        jsonError('Invalid JSON body', 400);
    }
    return $data;
}

function generateOTP(): string {
    global $OTP_LENGTH;
    return str_pad((string)random_int(0, (int)pow(10, $OTP_LENGTH) - 1), $OTP_LENGTH, '0', STR_PAD_LEFT);
}

function hashPassword(string $password): string {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

function verifyPassword(string $password, string $hash): bool {
    return password_verify($password, $hash);
}

function createJWT(array $payload): string {
    global $JWT_SECRET;
    $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload['iat'] = time();
    $payload['exp'] = time() + 86400 * 7; // 7 days
    $payloadEncoded = base64url_encode(json_encode($payload));
    $signature = base64url_encode(hash_hmac('sha256', "$header.$payloadEncoded", $JWT_SECRET, true));
    return "$header.$payloadEncoded.$signature";
}

function verifyJWT(string $token): ?array {
    global $JWT_SECRET;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $payload, $signature] = $parts;
    $expectedSig = base64url_encode(hash_hmac('sha256', "$header.$payload", $JWT_SECRET, true));
    if (!hash_equals($expectedSig, $signature)) return null;
    $data = json_decode(base64url_decode($payload), true);
    if (!$data || ($data['exp'] ?? 0) < time()) return null;
    return $data;
}

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

function requireAuth(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
        jsonError('Unauthorized', 401);
    }
    $payload = verifyJWT($m[1]);
    if (!$payload) {
        jsonError('Invalid or expired token', 401);
    }
    return $payload;
}

function sendOTPEmail(string $email, string $otp, string $name = '') {
    global $SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS, $SMTP_FROM_NAME;

    $greeting = $name ? "مرحباً $name" : 'مرحباً';
    $subject = "=?UTF-8?B?" . base64_encode("رمز التحقق — رايت ستيب") . "?=";

    $body = <<<HTML
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Tahoma, sans-serif; direction: rtl; text-align: right; background: #f7f7f7; padding: 40px 0;">
<div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
  <div style="text-align: center; margin-bottom: 32px;">
    <h2 style="color: #12294B; margin: 0;">رايت ستيب للاستشارات</h2>
  </div>
  <p style="color: #333; font-size: 16px;">{$greeting}،</p>
  <p style="color: #555; font-size: 15px;">رمز التحقق الخاص بك:</p>
  <div style="text-align: center; margin: 24px 0;">
    <span style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #12294B; background: #f0f7f7; padding: 16px 32px; border-radius: 12px; border: 2px solid #1596A0;">{$otp}</span>
  </div>
  <p style="color: #888; font-size: 13px;">ينتهي هذا الرمز خلال ١٠ دقائق. لا تشاركه مع أحد.</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 12px; text-align: center;">Right Step Consultancy — Abu Dhabi</p>
</div>
</body>
</html>
HTML;

    $headers = [
        "From: $SMTP_FROM_NAME <$SMTP_USER>",
        "Reply-To: $SMTP_USER",
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
    ];

    return mail($email, $subject, $body, implode("\r\n", $headers));
}
