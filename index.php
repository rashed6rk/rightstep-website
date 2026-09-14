<?php
$uri = urldecode($_SERVER['REQUEST_URI']);
$uri = strtok($uri, '?');
$uri = rtrim($uri, '/');

if ($uri === '' || $uri === '/') {
    header('Location: /ar.html', true, 302);
    exit;
}

$htmlFile = __DIR__ . $uri . '.html';
if (is_file($htmlFile)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($htmlFile);
    exit;
}

http_response_code(404);
if (is_file(__DIR__ . '/404.html')) {
    readfile(__DIR__ . '/404.html');
} else {
    echo 'Not found';
}
