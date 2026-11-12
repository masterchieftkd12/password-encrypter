const crypto = require('crypto');
const User = require('../models/User');
const EncryptionKey = require('../models/EncryptionKey');
const Session = require('../models/Session');
const { data, getNextId } = require('./data');
const encryptionService = require('./encryptionService');

function findUserById(id) {
  return data.users.find((u) => u.id === id);
}

function findUserByEmail(email) {
  return data.users.find((u) => u.email === email.toLowerCase());
}

function getKeyInfo(userId) {
  return data.keys.find((k) => k.userId === userId);
}

// Rule: name and email are required, email must be unique,
// master key must be at least 8 characters and typed twice the same.
async function register(name, email, masterKey, confirmKey, role = 'user') {
  if (!name || !email || !masterKey) {
    throw new Error('All fields are required.');
  }
  if (!email.includes('@')) {
    throw new Error('Please enter a valid email.');
  }
  if (findUserByEmail(email)) {
    throw new Error('An account with that email already exists.');
  }
  if (masterKey.length < 8) {
    throw new Error('Master key must be at least 8 characters.');
  }
  if (masterKey !== confirmKey) {
    throw new Error('Master keys do not match.');
  }

  const hash = await encryptionService.hashMasterKey(masterKey);
  const user = new User(getNextId(), name, email.toLowerCase(), hash, role);
  data.users.push(user);

  // every user gets their own random salt for encryption
  const salt = crypto.randomBytes(16).toString('hex');
  data.keys.push(new EncryptionKey(getNextId(), user.id, salt));

  return user;
}

async function login(email, masterKey) {
  const user = findUserByEmail(email || '');
  if (!user) {
    throw new Error('Wrong email or master key.');
  }
  const correct = await encryptionService.checkMasterKey(masterKey || '', user.masterKeyHash);
  if (!correct) {
    throw new Error('Wrong email or master key.');
  }
  return createSession(user.id);
}

function createSession(userId) {
  const sessionId = crypto.randomBytes(16).toString('hex');
  const session = new Session(sessionId, userId);
  data.sessions.push(session);
  return session;
}

function getSession(sessionId) {
  const session = data.sessions.find((s) => s.id === sessionId);
  if (session && session.isValid()) {
    return session;
  }
  return null;
}

function logout(sessionId) {
  const session = data.sessions.find((s) => s.id === sessionId);
  if (session) {
    session.status = 'logged out';
  }
}

// Rule: managers can see users but never their passwords,
// so only safe fields are returned here.
function getAllUsers() {
  return data.users.map((u) => ({
    name: u.name,
    email: u.email,
    role: u.role,
    entryCount: data.entries.filter((e) => e.userId === u.id).length
  }));
}

async function createManager() {
  if (!findUserByEmail('manager@test.com')) {
    await register('Manager', 'manager@test.com', 'manager123', 'manager123', 'manager');
    console.log('Manager account: manager@test.com / manager123');
  }
}

module.exports = {
  findUserById,
  getKeyInfo,
  register,
  login,
  createSession,
  getSession,
  logout,
  getAllUsers,
  createManager
};
