// adds security headers to every response
function securityHeaders(req, res, next) {
  res.removeHeader('X-Powered-By'); // don't tell attackers we use Express
  res.setHeader('X-Frame-Options', 'DENY'); // stops clickjacking
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'self'"); // only load our own files
  res.setHeader('Cache-Control', 'no-store'); // don't cache pages with passwords
  next();
}

module.exports = { securityHeaders };