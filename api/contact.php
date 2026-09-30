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

$to = 'contact@rightstepae.com';
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

// Send auto-reply to the client
$replySubject = "=?UTF-8?B?" . base64_encode("شكراً لتواصلك — الخطوة الصحيحة للاستشارات") . "?=";
$replyBody = <<<HTML
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"></head>
<body style="font-family: 'Segoe UI', Tahoma, sans-serif; direction: rtl; text-align: right; background: #f7f7f7; padding: 40px 0;">
<div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #12294B; margin: 0 0 4px;">الخطوة الصحيحة للاستشارات</h2>
    <p style="color: #1596A0; font-size: 13px; margin: 0;">Right Step Consultancy</p>
  </div>

  <p style="color: #333; font-size: 16px; margin-bottom: 4px;">مرحباً {$name}،</p>
  <p style="color: #555; font-size: 15px; line-height: 1.8;">
    شكراً لتواصلك معنا. وصلتنا رسالتك وسنرد عليك في أقرب وقت ممكن، عادةً خلال ٢٤ ساعة عمل.
  </p>

  <div style="background: #f0f7f7; border-radius: 12px; padding: 20px; margin: 20px 0; border-right: 4px solid #1596A0;">
    <p style="color: #12294B; font-weight: 600; font-size: 14px; margin: 0 0 8px;">ملخص رسالتك:</p>
    <p style="color: #555; font-size: 14px; margin: 4px 0;">الخدمة: {$service}</p>
    <p style="color: #555; font-size: 14px; margin: 4px 0; line-height: 1.6;">الرسالة: {$messageHtml}</p>
  </div>

  <p style="color: #555; font-size: 15px; line-height: 1.8;">
    إذا كان لديك أي استفسار عاجل، تواصل معنا مباشرة عبر واتساب:
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="https://wa.me/971555520071" style="display: inline-block; background: #25D366; color: white; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">تواصل عبر واتساب</a>
  </div>

  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="color: #aaa; font-size: 12px; text-align: center;">
    الخطوة الصحيحة للاستشارات — أبوظبي<br>
    <a href="https://rightstepae.com" style="color: #1596A0; text-decoration: none;">rightstepae.com</a>
     · <a href="tel:+971555520071" style="color: #1596A0; text-decoration: none;">+971 55 552 0071</a>
  </p>
</div>
</body>
</html>
HTML;

$replyHeaders = [
    "From: $SMTP_FROM_NAME <$SMTP_USER>",
    "Reply-To: contact@rightstepae.com",
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
];
@mail($email, $replySubject, $replyBody, implode("\r\n", $replyHeaders));

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
