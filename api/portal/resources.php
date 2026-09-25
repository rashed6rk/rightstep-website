<?php
require_once __DIR__ . '/../config.php';

$auth = requireAuth();
$userId = (int) $auth['sub'];
$db = getDB();

$stmt = $db->prepare("
    SELECT id, name_key AS nameKey, kind, size_kb AS sizeKb,
           step_key AS stepKey, file_url AS fileUrl, updated_at AS updatedISO
    FROM deliverables
    WHERE client_id = ?
    ORDER BY updated_at DESC
");
$stmt->execute([$userId]);
$deliverables = $stmt->fetchAll();

foreach ($deliverables as &$d) {
    $d['id'] = (int) $d['id'];
    $d['sizeKb'] = (int) $d['sizeKb'];
    $d['updatedISO'] = date('c', strtotime($d['updatedISO']));
}

jsonResponse(['deliverables' => $deliverables]);
