<?php
header('Content-Type: application/json; charset=utf-8');

$envFile = __DIR__ . '/.env';
$result = [
    'env_file_exists' => file_exists($envFile),
    'env_file_path' => $envFile,
    'current_dir' => __DIR__,
    'db_name_set' => !empty($_ENV['DB_NAME'] ?? getenv('DB_NAME')),
    'db_user_set' => !empty($_ENV['DB_USER'] ?? getenv('DB_USER')),
    'db_pass_set' => !empty($_ENV['DB_PASS'] ?? getenv('DB_PASS')),
];

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $result['env_line_count'] = count($lines);
    $keys = [];
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        $k = trim($key);
        $v = trim($val);
        $keys[] = $k . '=' . (empty($v) ? '(empty)' : '(set)');
    }
    $result['env_keys'] = $keys;
}

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
