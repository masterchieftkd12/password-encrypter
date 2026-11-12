const userService = require('../services/userService');

const cookieOptions = { httpOnly: true, sameSite: 'strict' };

function showRegister(req, res) {
  res.render('register', { title: 'Sign Up', error: null });
}

async function register(req, res) {
  const { name, email, masterKey, confirmKey } = req.body;
  try {
    const user = await userService.register(name, email, masterKey, confirmKey);
    const session = userService.createSession(user.id);
    res.cookie('sessionId', session.id, cookieOptions);
    res.redirect('/passwords');
  } catch (err) {
    res.render('register', { title: 'Sign Up', error: err.message });
  }
}

function showLogin(req, res) {
  res.render('login', { title: 'Log In', error: null });
}

async function login(req, res) {
  try {
    const session = await userService.login(req.body.email, req.body.masterKey);
    res.cookie('sessionId', session.id, cookieOptions);
    const user = userService.findUserById(session.userId);
    if (user.role === 'manager') {
      res.redirect('/manager');
    } else {
      res.redirect('/passwords');
    }
  } catch (err) {
    res.render('login', { title: 'Log In', error: err.message });
  }
}

function logout(req, res) {
  userService.logout(req.cookies.sessionId);
  res.clearCookie('sessionId');
  res.redirect('/');
}

module.exports = { showRegister, register, showLogin, login, logout };
