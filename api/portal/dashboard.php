<?php
require_once __DIR__ . '/../config.php';

$auth = requireAuth();
$userId = (int) $auth['sub'];
$db = getDB();

$profile = $db->prepare("
    SELECT company, industry, goals, current_step, turn, turn_since, consultant, status
    FROM client_profiles WHERE user_id = ?
");
$profile->execute([$userId]);
$p = $profile->fetch();

$stepOrder = ['learn' => 0, 'practice' => 1, 'improve' => 2, 'impact' => 3];
$currentStep = $p ? $p['current_step'] : 'learn';
$currentIndex = $stepOrder[$currentStep] ?? 0;

$delivCounts = $db->prepare("
    SELECT step_key, COUNT(*) AS cnt FROM deliverables WHERE client_id = ? GROUP BY step_key
");
$delivCounts->execute([$userId]);
$countMap = [];
foreach ($delivCounts->fetchAll() as $r) {
    $countMap[$r['step_key']] = (int) $r['cnt'];
}

$journeySteps = $db->prepare("
    SELECT step_key, completed_at FROM journey_steps WHERE client_id = ? ORDER BY FIELD(step_key, 'learn','practice','improve','impact')
");
$journeySteps->execute([$userId]);
$completionMap = [];
foreach ($journeySteps->fetchAll() as $r) {
    $completionMap[$r['step_key']] = $r['completed_at'];
}

$journey = [];
foreach (['learn', 'practice', 'improve', 'impact'] as $i => $key) {
    $status = $i < $currentIndex ? 'done' : ($i === $currentIndex ? 'current' : 'upcoming');
    $journey[] = [
        'key' => $key,
        'status' => $status,
        'completedOn' => isset($completionMap[$key]) && $completionMap[$key] ? date('c', strtotime($completionMap[$key])) : null,
        'deliverables' => $countMap[$key] ?? 0,
    ];
}

$nextSession = $db->prepare("
    SELECT id, title_key AS titleKey, start_at AS startISO, duration_minutes AS minutes,
           consultant, meet_url AS meetUrl
    FROM consulting_sessions
    WHERE client_id = ? AND status = 'scheduled' AND start_at > NOW()
    ORDER BY start_at ASC LIMIT 1
");
$nextSession->execute([$userId]);
$ns = $nextSession->fetch();
if ($ns) {
    $ns['id'] = (int) $ns['id'];
    $ns['minutes'] = (int) $ns['minutes'];
    $ns['startISO'] = date('c', strtotime($ns['startISO']));
    $ns['calendarUrl'] = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
}

$recentDeliverables = $db->prepare("
    SELECT id, name_key AS nameKey, kind, size_kb AS sizeKb, step_key AS stepKey, updated_at AS updatedISO
    FROM deliverables WHERE client_id = ? ORDER BY updated_at DESC LIMIT 5
");
$recentDeliverables->execute([$userId]);
$deliverables = $recentDeliverables->fetchAll();
foreach ($deliverables as &$d) {
    $d['id'] = (int) $d['id'];
    $d['sizeKb'] = (int) $d['sizeKb'];
    $d['updatedISO'] = date('c', strtotime($d['updatedISO']));
}

jsonResponse([
    'profile' => $p ? [
        'company' => $p['company'],
        'industry' => $p['industry'],
        'goals' => $p['goals'],
    ] : null,
    'journey' => $journey,
    'turn' => $p ? $p['turn'] : 'clear',
    'nextSession' => $ns ?: null,
    'deliverables' => $deliverables,
]);
