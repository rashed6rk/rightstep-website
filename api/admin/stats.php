<?php
require_once __DIR__ . '/../config.php';

$auth = requireAuth();
if (($auth['role'] ?? '') !== 'admin') jsonError('Admin only', 403);

$db = getDB();

$active = $db->query("SELECT COUNT(*) FROM client_profiles WHERE status = 'active'")->fetchColumn();
$revenue = $db->query("SELECT COALESCE(SUM(monthly_fee_aed), 0) FROM client_profiles WHERE status = 'active'")->fetchColumn();
$weekSessions = $db->query("SELECT COUNT(*) FROM consulting_sessions WHERE status = 'scheduled' AND start_at BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)")->fetchColumn();
$attention = $db->query("SELECT COUNT(*) FROM client_profiles WHERE status = 'active' AND turn = 'client'")->fetchColumn();

jsonResponse([
    'activeClients' => (int) $active,
    'monthlyRevenueAed' => (float) $revenue,
    'sessionsThisWeek' => (int) $weekSessions,
    'needsAttention' => (int) $attention,
]);
