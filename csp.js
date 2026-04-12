(function () {
  const isLocalhost =
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname === '::1';

  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = isLocalhost
    ? "default-src 'self'; connect-src https://generativelanguage.googleapis.com http://localhost:5173 http://localhost:5174 ws://localhost:5173 ws://localhost:5174; script-src 'self'; style-src 'self' 'unsafe-inline';"
    : "default-src 'self'; connect-src https://generativelanguage.googleapis.com; script-src 'self'; style-src 'self';";

  document.head.appendChild(meta);
})();
