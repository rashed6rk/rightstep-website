<?php
require_once __DIR__ . '/config.php';

$defaultPassword = 'RightStep2024!';
$hash = hashPassword($defaultPassword);

try {
    $db = getDB();

    $schema = file_get_contents(__DIR__ . '/schema.sql');
    $statements = array_filter(
        array_map('trim', explode(';', $schema)),
        fn($s) => !empty($s) && stripos($s, 'INSERT') === false
    );

    foreach ($statements as $sql) {
        $db->exec($sql);
    }

    $stmt = $db->prepare("
        INSERT INTO users (name, email, phone, password_hash, role, email_verified)
        VALUES (:name, :email, :phone, :hash, 'admin', 1)
        ON DUPLICATE KEY UPDATE password_hash = :hash2, name = :name2
    ");
    $stmt->execute([
        ':name' => 'د. عبدالهادي',
        ':email' => 'rightstepscons@gmail.com',
        ':phone' => '+971555520071',
        ':hash' => $hash,
        ':hash2' => $hash,
        ':name2' => 'د. عبدالهادي',
    ]);

    jsonResponse([
        'success' => true,
        'message' => 'Database set up successfully. Admin account ready.',
        'admin_email' => 'rightstepscons@gmail.com',
        'default_password' => $defaultPassword,
        'note' => 'Change the password after first login. Delete this file from the server.',
    ]);
} catch (PDOException $e) {
    jsonError('Database setup failed: ' . $e->getMessage(), 500);
}
