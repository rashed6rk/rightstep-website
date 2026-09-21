<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$data = getJsonInput();

$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$phone   = trim($data['phone'] ?? '');
$service = trim($data['service'] ?? '');
$budget  = trim($data['budget'] ?? '');
$message = trim($data['message'] ?? '');

if (!$name || !$email || !$message) {
    jsonError('الاسم والبريد والرسالة مطلوبة', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonError('بريد إلكتروني غير صالح', 400);
}

$to = 'rightstepscons@gmail.com';
$subject = "=?UTF-8?B?" . base64_encode("رسالة جديدة من الموقع — $name") . "?=";

$body = <<<HTML
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Tahoma, sans-serif; direction: rtl; text-align: right; background: #f7f7f7; padding: 40px 0;">
<div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
  <h2 style="color: #12294B; margin: 0 0 24px;">رسالة جديدة من الموقع</h2>

  <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
    <tr>
      <td style="padding: 10px 0; color: #888; width: 120px; vertical-align: top;">الاسم</td>
      <td style="padding: 10px 0; color: #333; font-weight: 600;">{$name}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; color: #888; border-top: 1px solid #f0f0f0; vertical-align: top;">البريد</td>
      <td style="padding: 10px 0; color: #333; border-top: 1px solid #f0f0f0;">
        <a href="mailto:{$email}" style="color: #1596A0; text-decoration: none;">{$email}</a>
      </td>
    </tr>
HTML;

if ($phone) {
    $body .= <<<HTML
    <tr>
      <td style="padding: 10px 0; color: #888; border-top: 1px solid #f0f0f0; vertical-align: top;">الهاتف</td>
      <td style="padding: 10px 0; color: #333; border-top: 1px solid #f0f0f0;">
        <a href="tel:{$phone}" style="color: #1596A0; text-decoration: none;">{$phone}</a>
      </td>
    </tr>
HTML;
}

if ($service) {
    $body .= <<<HTML
    <tr>
      <td style="padding: 10px 0; color: #888; border-top: 1px solid #f0f0f0; vertical-align: top;">الخدمة</td>
      <td style="padding: 10px 0; color: #333; border-top: 1px solid #f0f0f0;">{$service}</td>
    </tr>
HTML;
}

if ($budget) {
    $body .= <<<HTML
    <tr>
      <td style="padding: 10px 0; color: #888; border-top: 1px solid #f0f0f0; vertical-align: top;">الميزانية</td>
      <td style="padding: 10px 0; color: #333; border-top: 1px solid #f0f0f0;">{$budget}</td>
    </tr>
HTML;
}

$messageHtml = nl2br(htmlspecialchars($message));
$body .= <<<HTML
    <tr>
      <td style="padding: 10px 0; color: #888; border-top: 1px solid #f0f0f0; vertical-align: top;">الرسالة</td>
      <td style="padding: 10px 0; color: #333; border-top: 1px solid #f0f0f0; line-height: 1.7;">{$messageHtml}</td>
    </tr>
  </table>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 12px; text-align: center;">
    أُرسلت من نموذج التواصل في rightstepae.com
  </p>
</div>
</body>
</html>
HTML;

global $SMTP_USER, $SMTP_FROM_NAME;
$headers = [
    "From: $SMTP_FROM_NAME <$SMTP_USER>",
    "Reply-To: $name <$email>",
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    jsonError('فشل إرسال الرسالة. حاول مرة أخرى.', 500);
}

// Save to database if available
try {
    $db = getDB();
    $stmt = $db->prepare("
        INSERT INTO contact_messages (name, email, phone, service, budget, message, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$name, $email, $phone, $service, $budget, $message]);
} catch (Exception $e) {
    // Don't fail the response if DB save fails - email was already sent
}

jsonResponse(['success' => true, 'message' => 'تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.']);
