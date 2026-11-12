const userService = require('../services/userService');

// looks at the session cookie and finds the logged in user
function loadUser(req, res, next) {
  const session = userService.getSession(req.cookies.sessionId);
  if (session) {
    req.user = userService.findUserById(session.userId);
  }
  res.locals.user = req.user; // so every view can use "user"
  next();
}

function requireLogin(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
}

function requireManager(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  if (req.user.role !== 'manager') {
    return res.status(403).render('error', { title: 'Error', message: 'Only managers can see this page.' });
  }
  next();
}

module.exports = { loadUser, requireLogin, requireManager };