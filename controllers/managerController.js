const userService = require('../services/userService');
const passwordService = require('../services/passwordService');

function dashboard(req, res) {
  const users = userService.getAllUsers();
  const logs = passwordService.getAllLogs();
  res.render('manager', { title: 'Manager', users, logs });
}

module.exports = { dashboard };
