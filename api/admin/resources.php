<?php
require_once __DIR__ . '/../config.php';

$auth = requireAuth();
if (($auth['role'] ?? '') !== 'admin') jsonError('Admin only', 403);

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $clientId = $_GET['client_id'] ?? null;
    $where = "1=1";
    $params = [];

    if ($clientId) {
        $where .= " AND d.client_id = ?";
        $params[] = $clientId;
    }

    $stmt = $db->prepare("
        SELECT d.id, d.client_id AS clientId, d.name_key AS nameKey,
               d.kind, d.size_kb AS sizeKb, d.step_key AS stepKey,
               d.file_url AS fileUrl, d.updated_at AS updatedISO
        FROM deliverables d
        WHERE $where
        ORDER BY d.updated_at DESC
    ");
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['id'] = (int) $r['id'];
        $r['clientId'] = (int) $r['clientId'];
        $r['sizeKb'] = (int) $r['sizeKb'];
        $r['updatedISO'] = date('c', strtotime($r['updatedISO']));
    }

    jsonResponse(['resources' => $rows]);
}

if ($method === 'POST') {
    $data = getJsonInput();
    $action = $data['action'] ?? 'create';

    if ($action === 'create') {
        $clientId = (int) ($data['client_id'] ?? 0);
        $nameKey = $data['name_key'] ?? '';
        $kind = $data['kind'] ?? 'report';
        $sizeKb = (int) ($data['size_kb'] ?? 0);
        $stepKey = $data['step_key'] ?? 'learn';
        $fileUrl = $data['file_url'] ?? '';

        if (!$clientId || !$nameKey) jsonError('client_id and name_key required');

        $stmt = $db->prepare("INSERT INTO deliverables (client_id, name_key, kind, size_kb, step_key, file_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$clientId, $nameKey, $kind, $sizeKb, $stepKey, $fileUrl]);
        jsonResponse(['success' => true, 'id' => (int) $db->lastInsertId()], 201);
    }

    if ($action === 'update') {
        $id = (int) ($data['id'] ?? 0);
        if (!$id) jsonError('Deliverable ID required');

        $fields = [];
        $params = [];
        if (isset($data['name_key'])) { $fields[] = 'name_key = ?'; $params[] = $data['name_key']; }
        if (isset($data['kind'])) { $fields[] = 'kind = ?'; $params[] = $data['kind']; }
        if (isset($data['size_kb'])) { $fields[] = 'size_kb = ?'; $params[] = (int) $data['size_kb']; }
        if (isset($data['step_key'])) { $fields[] = 'step_key = ?'; $params[] = $data['step_key']; }
        if (isset($data['file_url'])) { $fields[] = 'file_url = ?'; $params[] = $data['file_url']; }

        if (!$fields) jsonError('No fields to update');

        $params[] = $id;
        $db->prepare("UPDATE deliverables SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonResponse(['success' => true]);
    }

    if ($action === 'delete') {
        $id = (int) ($data['id'] ?? 0);
        if (!$id) jsonError('Deliverable ID required');
        $db->prepare("DELETE FROM deliverables WHERE id = ?")->execute([$id]);
        jsonResponse(['success' => true]);
    }
}
