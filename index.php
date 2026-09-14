<?php
$uri = $_SERVER['REQUEST_URI'];
$uri = strtok($uri, '?');
$uri = rtrim($uri, '/');

if ($uri === '' || $uri === '/') {
    header('Location: /out/ar.html', true, 302);
    exit;
}

// If the path already starts with /out/, serve from document root directly
if (strpos($uri, '/out/') === 0) {
    $file = __DIR__ . $uri;
    if (is_file($file)) {
        serveFile($file);
    }
    http_response_code(404);
    exit;
}

// Map the URI into the out/ directory
$path = __DIR__ . '/out' . $uri;

// Exact file match (JS, CSS, images, fonts, etc.)
if (is_file($path)) {
    serveFile($path);
}

// Try .html extension (Next.js static export pattern)
if (is_file($path . '.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($path . '.html');
    exit;
}

// Try directory with index.html
if (is_dir($path) && is_file($path . '/index.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($path . '/index.html');
    exit;
}

// 404
http_response_code(404);
if (is_file(__DIR__ . '/out/404.html')) {
    readfile(__DIR__ . '/out/404.html');
} else {
    echo 'Page not found';
}
exit;

function serveFile($file) {
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $mimeMap = [
        'html' => 'text/html; charset=utf-8',
        'css'  => 'text/css; charset=utf-8',
        'js'   => 'application/javascript; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'svg'  => 'image/svg+xml',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'avif' => 'image/avif',
        'gif'  => 'image/gif',
        'ico'  => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2'=> 'font/woff2',
        'ttf'  => 'font/ttf',
        'txt'  => 'text/plain; charset=utf-8',
        'xml'  => 'application/xml; charset=utf-8',
        'map'  => 'application/json',
    ];
    $mime = $mimeMap[$ext] ?? 'application/octet-stream';
    header("Content-Type: $mime");
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
}
