const PasswordEntry = require('../models/PasswordEntry');
const EncryptionLog = require('../models/EncryptionLog');
const { data, getNextId } = require('./data');
const encryptionService = require('./encryptionService');
const userService = require('./userService');

function addLog(userId, entryId, action, success) {
  data.logs.push(new EncryptionLog(getNextId(), userId, entryId, action, success));
}

function getEntries(userId) {
  return data.entries.filter((e) => e.userId === userId);
}

// Rule: users can only get their own entries.
function getEntry(userId, entryId) {
  const entry = data.entries.find((e) => e.id === Number(entryId));
  if (!entry || entry.userId !== userId) {
    throw new Error('Password entry not found.');
  }
  return entry;
}

// Rule: the master key must be correct before anything is encrypted.
async function checkKey(user, masterKey) {
  const correct = await encryptionService.checkMasterKey(masterKey || '', user.masterKeyHash);
  if (!correct) {
    throw new Error('Wrong master key.');
  }
}

async function addEntry(user, label, username, password, masterKey) {
  if (!label || !password) {
    throw new Error('Label and password are required.');
  }
  await checkKey(user, masterKey);

  const keyInfo = userService.getKeyInfo(user.id);
  const encrypted = await encryptionService.encrypt(password, masterKey, keyInfo);
  const entry = new PasswordEntry(getNextId(), user.id, label, username, encrypted);
  data.entries.push(entry);
  addLog(user.id, entry.id, 'encrypt', true);
  return entry;
}

// Rule: a password can only be shown with the correct master key.
// Every try is saved in the log, even failed ones.
async function decryptEntry(user, entryId, masterKey) {
  const entry = getEntry(user.id, entryId);
  const keyInfo = userService.getKeyInfo(user.id);
  try {
    const password = await encryptionService.decrypt(entry.encryptedPassword, masterKey || '', keyInfo);
    addLog(user.id, entry.id, 'decrypt', true);
    return password;
  } catch (err) {
    addLog(user.id, entry.id, 'decrypt', false);
    throw new Error('Wrong master key. The password stays encrypted.');
  }
}

// Rule: label and username can change freely,
// but a new password needs the master key so it can be encrypted.
async function editEntry(user, entryId, label, username, newPassword, masterKey) {
  const entry = getEntry(user.id, entryId);
  if (!label) {
    throw new Error('Label is required.');
  }
  if (newPassword) {
    await checkKey(user, masterKey);
    const keyInfo = userService.getKeyInfo(user.id);
    entry.encryptedPassword = await encryptionService.encrypt(newPassword, masterKey, keyInfo);
  }
  entry.label = label;
  entry.username = username;
  addLog(user.id, entry.id, 'edit', true);
  return entry;
}

function deleteEntry(user, entryId) {
  const entry = getEntry(user.id, entryId);
  data.entries = data.entries.filter((e) => e.id !== entry.id);
  addLog(user.id, entry.id, 'delete', true);
}

function getLogs(userId) {
  return data.logs.filter((l) => l.userId === userId).reverse();
}

function getAllLogs() {
  return data.logs.map((l) => {
    const user = userService.findUserById(l.userId);
    return { ...l, email: user ? user.email : 'unknown' };
  }).reverse();
}

module.exports = {
  getEntries,
  getEntry,
  addEntry,
  decryptEntry,
  editEntry,
  deleteEntry,
  getLogs,
  getAllLogs
};
