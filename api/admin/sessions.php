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
        $where .= " AND cs.client_id = ?";
        $params[] = $clientId;
    }

    $stmt = $db->prepare("
        SELECT cs.id, cs.client_id AS clientId, cs.title_key AS titleKey,
               cs.start_at AS startISO, cs.duration_minutes AS minutes,
               cs.consultant, cs.meet_url AS meetUrl, cs.status, cs.notes
        FROM consulting_sessions cs
        WHERE $where
        ORDER BY cs.start_at ASC
    ");
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    foreach ($rows as &$r) {
        $r['id'] = (int) $r['id'];
        $r['clientId'] = (int) $r['clientId'];
        $r['minutes'] = (int) $r['minutes'];
        $r['startISO'] = date('c', strtotime($r['startISO']));
    }

    jsonResponse(['sessions' => $rows]);
}

if ($method === 'POST') {
    $data = getJsonInput();
    $action = $data['action'] ?? 'create';

    if ($action === 'create') {
        $clientId = (int) ($data['client_id'] ?? 0);
        $titleKey = $data['title_key'] ?? 'coachingSession';
        $startAt = $data['start_at'] ?? '';
        $minutes = (int) ($data['duration_minutes'] ?? 60);
        $consultant = $data['consultant'] ?? 'د. عبدالهادي';
        $meetUrl = $data['meet_url'] ?? '';

        if (!$clientId || !$startAt) jsonError('client_id and start_at required');

        $stmt = $db->prepare("INSERT INTO consulting_sessions (client_id, title_key, start_at, duration_minutes, consultant, meet_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$clientId, $titleKey, $startAt, $minutes, $consultant, $meetUrl]);
        jsonResponse(['success' => true, 'id' => (int) $db->lastInsertId()], 201);
    }

    if ($action === 'update') {
        $id = (int) ($data['id'] ?? 0);
        if (!$id) jsonError('Session ID required');

        $fields = [];
        $params = [];
        if (isset($data['title_key'])) { $fields[] = 'title_key = ?'; $params[] = $data['title_key']; }
        if (isset($data['start_at'])) { $fields[] = 'start_at = ?'; $params[] = $data['start_at']; }
        if (isset($data['duration_minutes'])) { $fields[] = 'duration_minutes = ?'; $params[] = (int) $data['duration_minutes']; }
        if (isset($data['meet_url'])) { $fields[] = 'meet_url = ?'; $params[] = $data['meet_url']; }
        if (isset($data['notes'])) { $fields[] = 'notes = ?'; $params[] = $data['notes']; }
        if (isset($data['status'])) { $fields[] = 'status = ?'; $params[] = $data['status']; }
        if (isset($data['consultant'])) { $fields[] = 'consultant = ?'; $params[] = $data['consultant']; }

        if (!$fields) jsonError('No fields to update');

        $params[] = $id;
        $db->prepare("UPDATE consulting_sessions SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        jsonResponse(['success' => true]);
    }

    if ($action === 'delete') {
        $id = (int) ($data['id'] ?? 0);
        if (!$id) jsonError('Session ID required');
        $db->prepare("DELETE FROM consulting_sessions WHERE id = ?")->execute([$id]);
        jsonResponse(['success' => true]);
    }
}
