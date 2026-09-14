<?php
$uri = $_SERVER['REQUEST_URI'];
$uri = strtok($uri, '?');
$uri = rtrim($uri, '/');

if ($uri === '' || $uri === '/') {
    header('Location: /out/ar.html', true, 302);
    exit;
}

$path = __DIR__ . '/out' . $uri;

if (is_file($path)) {
    return false;
}

if (is_file($path . '.html')) {
    $mime = 'text/html';
    header("Content-Type: $mime; charset=utf-8");
    readfile($path . '.html');
    exit;
}

if (is_dir($path) && is_file($path . '/index.html')) {
    header("Content-Type: text/html; charset=utf-8");
    readfile($path . '/index.html');
    exit;
}

$ext = pathinfo($path, PATHINFO_EXTENSION);
if ($ext) {
    $mimeMap = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ico' => 'image/x-icon',
        'txt' => 'text/plain',
    ];
    if (isset($mimeMap[$ext]) && is_file($path)) {
        header("Content-Type: {$mimeMap[$ext]}");
        readfile($path);
        exit;
    }
}

http_response_code(404);
if (is_file(__DIR__ . '/out/404.html')) {
    readfile(__DIR__ . '/out/404.html');
} else {
    echo 'Page not found';
}
