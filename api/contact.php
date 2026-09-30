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

$messageHtml = nl2br(htmlspecialchars($message));

// --- 1. Notification email to Right Step ---
$to = 'contact@rightstepae.com';
$subject = "=?UTF-8?B?" . base64_encode("رسالة جديدة من الموقع — $name") . "?=";

$rows = '';
$fields = [
    ['الاسم', $name],
    ['البريد', "<a href=\"mailto:{$email}\" style=\"color: #1596A0; text-decoration: none;\">{$email}</a>"],
];
if ($phone) $fields[] = ['الهاتف', "<a href=\"tel:{$phone}\" style=\"color: #1596A0; text-decoration: none;\">{$phone}</a>"];
if ($service) $fields[] = ['الخدمة', $service];
if ($budget) $fields[] = ['الميزانية', $budget];
$fields[] = ['الرسالة', $messageHtml];

foreach ($fields as $i => $f) {
    $border = $i > 0 ? 'border-top: 1px solid #dae1ea;' : '';
    $rows .= "<tr>
      <td style=\"padding: 12px 0; color: #636e7d; width: 100px; vertical-align: top; font-size: 13px; {$border}\">{$f[0]}</td>
      <td style=\"padding: 12px 0; color: #1B2430; font-size: 14px; line-height: 1.7; {$border}\">{$f[1]}</td>
    </tr>";
}

$notifContent = <<<HTML
      <p style="color: #12294B; font-size: 18px; font-weight: 700; margin: 0 0 20px;">رسالة جديدة من الموقع</p>
      <table style="width: 100%; border-collapse: collapse;">{$rows}</table>
      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:{$email}" style="display: inline-block; background: #E8873A; color: #12294B; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">الرد على {$name}</a>
      </div>
HTML;

$body = emailWrap($notifContent);

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

// --- 2. Auto-reply to the client ---
$replySubject = "=?UTF-8?B?" . base64_encode("شكراً لتواصلك — Right Step") . "?=";

$replyContent = <<<HTML
      <p style="color: #1B2430; font-size: 16px; margin: 0 0 8px;">مرحباً {$name}،</p>
      <p style="color: #4C5B6E; font-size: 15px; margin: 0 0 24px; line-height: 1.8;">
        شكراً لتواصلك معنا. وصلتنا رسالتك وسنرد عليك في أقرب وقت ممكن، عادةً خلال ٢٤ ساعة عمل.
      </p>

      <div style="background: #ecf6f7; border-radius: 12px; padding: 20px; margin: 0 0 24px; border-right: 4px solid #1596A0;">
        <p style="color: #12294B; font-weight: 700; font-size: 14px; margin: 0 0 10px;">ملخص رسالتك:</p>
        <p style="color: #4C5B6E; font-size: 14px; margin: 4px 0;"><strong style="color: #12294B;">الخدمة:</strong> {$service}</p>
        <p style="color: #4C5B6E; font-size: 14px; margin: 4px 0; line-height: 1.6;"><strong style="color: #12294B;">الرسالة:</strong> {$messageHtml}</p>
      </div>

      <p style="color: #4C5B6E; font-size: 15px; margin: 0 0 16px; line-height: 1.8;">
        إذا كان لديك أي استفسار عاجل، تواصل معنا مباشرة:
      </p>
      <div style="text-align: center;">
        <a href="https://wa.me/971555520071" style="display: inline-block; background: #1596A0; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px;">تواصل عبر واتساب</a>
      </div>
HTML;

$replyBody = emailWrap($replyContent);

$replyHeaders = [
    "From: $SMTP_FROM_NAME <$SMTP_USER>",
    "Reply-To: contact@rightstepae.com",
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
];
@mail($email, $replySubject, $replyBody, implode("\r\n", $replyHeaders));

// --- 3. Save to database ---
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
