<?php
require_once __DIR__ . '/../config.php';

$auth = requireAuth();
if (($auth['role'] ?? '') !== 'admin') jsonError('Admin only', 403);

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;

    if ($id) {
        $stmt = $db->prepare("
            SELECT u.id, u.name, u.email, u.phone, u.created_at AS joined_at,
                   p.company, p.industry, p.goals, p.current_step, p.turn, p.turn_since,
                   p.consultant, p.status, p.monthly_fee_aed
            FROM users u
            JOIN client_profiles p ON p.user_id = u.id
            WHERE u.id = ? AND u.role = 'client'
        ");
        $stmt->execute([$id]);
        $client = $stmt->fetch();
        if (!$client) jsonError('Client not found', 404);

        $sessions = $db->prepare("
            SELECT id, title_key, start_at, duration_minutes, consultant, meet_url, status
            FROM consulting_sessions WHERE client_id = ? ORDER BY start_at DESC
        ");
        $sessions->execute([$id]);

        $resources = $db->prepare("
            SELECT id, name_key, kind, size_kb, step_key, file_url, updated_at
            FROM deliverables WHERE client_id = ? ORDER BY updated_at DESC
        ");
        $resources->execute([$id]);

        jsonResponse([
            'client' => formatClient($client),
            'sessions' => $sessions->fetchAll(),
            'resources' => $resources->fetchAll(),
        ]);
    }

    $rows = $db->query("
        SELECT u.id, u.name, u.email, u.phone, u.created_at AS joined_at,
               p.company, p.industry, p.goals, p.current_step, p.turn, p.turn_since,
               p.consultant, p.status, p.monthly_fee_aed,
               (SELECT MIN(cs.start_at) FROM consulting_sessions cs
                WHERE cs.client_id = u.id AND cs.status = 'scheduled' AND cs.start_at > NOW()) AS next_session_at,
               COALESCE(p.updated_at, u.updated_at) AS last_activity
        FROM users u
        JOIN client_profiles p ON p.user_id = u.id
        WHERE u.role = 'client'
        ORDER BY p.status = 'active' DESC, p.updated_at DESC
    ")->fetchAll();

    $clients = array_map('formatClient', $rows);
    jsonResponse(['clients' => $clients]);
}

if ($method === 'POST') {
    $data = getJsonInput();
    $action = $data['action'] ?? 'create';

    if ($action === 'create') {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $company = trim($data['company'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $industry = $data['industry'] ?? 'communication';
        $password = $data['password'] ?? bin2hex(random_bytes(8));

        if (!$name || !$email) jsonError('Name and email are required');

        $exists = $db->prepare("SELECT id FROM users WHERE email = ?");
        $exists->execute([$email]);
        if ($exists->fetch()) jsonError('Email already exists');

        $db->beginTransaction();
        try {
            $stmt = $db->prepare("INSERT INTO users (name, email, phone, password_hash, role, email_verified) VALUES (?, ?, ?, ?, 'client', 1)");
            $stmt->execute([$name, $email, $phone, hashPassword($password)]);
            $userId = $db->lastInsertId();

            $stmt = $db->prepare("INSERT INTO client_profiles (user_id, company, industry) VALUES (?, ?, ?)");
            $stmt->execute([$userId, $company, $industry]);

            $db->commit();
            jsonResponse(['success' => true, 'id' => (int) $userId], 201);
        } catch (PDOException $e) {
            $db->rollBack();
            jsonError('Failed to create client: ' . $e->getMessage(), 500);
        }
    }

    if ($action === 'update') {
        $id = (int) ($data['id'] ?? 0);
        if (!$id) jsonError('Client ID required');

        $fields = [];
        $userFields = [];
        $params = [];
        $userParams = [];

        if (isset($data['company'])) { $fields[] = 'company = ?'; $params[] = $data['company']; }
        if (isset($data['industry'])) { $fields[] = 'industry = ?'; $params[] = $data['industry']; }
        if (isset($data['goals'])) { $fields[] = 'goals = ?'; $params[] = $data['goals']; }
        if (isset($data['current_step'])) { $fields[] = 'current_step = ?'; $params[] = $data['current_step']; }
        if (isset($data['turn'])) { $fields[] = 'turn = ?'; $params[] = $data['turn']; $fields[] = 'turn_since = NOW()'; }
        if (isset($data['status'])) { $fields[] = 'status = ?'; $params[] = $data['status']; }
        if (isset($data['monthly_fee_aed'])) { $fields[] = 'monthly_fee_aed = ?'; $params[] = $data['monthly_fee_aed']; }
        if (isset($data['consultant'])) { $fields[] = 'consultant = ?'; $params[] = $data['consultant']; }

        if (isset($data['name'])) { $userFields[] = 'name = ?'; $userParams[] = $data['name']; }
        if (isset($data['email'])) { $userFields[] = 'email = ?'; $userParams[] = $data['email']; }
        if (isset($data['phone'])) { $userFields[] = 'phone = ?'; $userParams[] = $data['phone']; }

        $db->beginTransaction();
        try {
            if ($fields) {
                $params[] = $id;
                $db->prepare("UPDATE client_profiles SET " . implode(', ', $fields) . " WHERE user_id = ?")->execute($params);
            }
            if ($userFields) {
                $userParams[] = $id;
                $db->prepare("UPDATE users SET " . implode(', ', $userFields) . " WHERE id = ?")->execute($userParams);
            }
            $db->commit();
            jsonResponse(['success' => true]);
        } catch (PDOException $e) {
            $db->rollBack();
            jsonError('Update failed: ' . $e->getMessage(), 500);
        }
    }

    if ($action === 'delete') {
        $id = (int) ($data['id'] ?? 0);
        if (!$id) jsonError('Client ID required');
        $db->prepare("DELETE FROM users WHERE id = ? AND role = 'client'")->execute([$id]);
        jsonResponse(['success' => true]);
    }
}

function formatClient(array $row): array {
    $name = $row['name'];
    $words = explode(' ', $name);
    $initials = mb_substr($words[0], 0, 1, 'UTF-8');
    if (count($words) > 1) $initials .= mb_substr($words[count($words) - 1], 0, 1, 'UTF-8');

    return [
        'id' => (int) $row['id'],
        'name' => $name,
        'company' => $row['company'] ?? '',
        'industry' => $row['industry'] ?? 'communication',
        'initials' => $initials,
        'email' => $row['email'],
        'phone' => $row['phone'] ?? '',
        'status' => $row['status'] ?? 'active',
        'stepKey' => $row['current_step'] ?? 'learn',
        'turn' => $row['turn'] ?? 'clear',
        'turnSinceISO' => $row['turn_since'] ? date('c', strtotime($row['turn_since'])) : date('c'),
        'nextSessionISO' => isset($row['next_session_at']) && $row['next_session_at'] ? date('c', strtotime($row['next_session_at'])) : null,
        'consultant' => $row['consultant'] ?? 'د. عبدالهادي',
        'monthlyFeeAed' => (float) ($row['monthly_fee_aed'] ?? 0),
        'lastActivityISO' => isset($row['last_activity']) ? date('c', strtotime($row['last_activity'])) : date('c'),
        'joinedISO' => date('c', strtotime($row['joined_at'])),
        'goals' => $row['goals'] ?? '',
    ];
}
