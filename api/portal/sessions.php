<?php
require_once __DIR__ . '/../config.php';

$auth = requireAuth();
$userId = (int) $auth['sub'];
$db = getDB();

$upcoming = $db->prepare("
    SELECT id, title_key AS titleKey, start_at AS startISO, duration_minutes AS minutes,
           consultant, meet_url AS meetUrl
    FROM consulting_sessions
    WHERE client_id = ? AND status = 'scheduled' AND start_at > NOW()
    ORDER BY start_at ASC
");
$upcoming->execute([$userId]);
$upcomingSessions = $upcoming->fetchAll();

foreach ($upcomingSessions as &$s) {
    $s['id'] = (int) $s['id'];
    $s['minutes'] = (int) $s['minutes'];
    $s['startISO'] = date('c', strtotime($s['startISO']));
    $s['calendarUrl'] = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
}

$past = $db->prepare("
    SELECT id, title_key AS titleKey, start_at AS startISO, duration_minutes AS minutes,
           consultant, CASE WHEN notes IS NOT NULL AND notes != '' THEN 1 ELSE 0 END AS hasNotes
    FROM consulting_sessions
    WHERE client_id = ? AND (status = 'completed' OR (status = 'scheduled' AND start_at <= NOW()))
    ORDER BY start_at DESC
");
$past->execute([$userId]);
$pastSessions = $past->fetchAll();

foreach ($pastSessions as &$s) {
    $s['id'] = (int) $s['id'];
    $s['minutes'] = (int) $s['minutes'];
    $s['startISO'] = date('c', strtotime($s['startISO']));
    $s['hasNotes'] = (bool) $s['hasNotes'];
}

jsonResponse([
    'upcomingSessions' => $upcomingSessions,
    'pastSessions' => $pastSessions,
]);
