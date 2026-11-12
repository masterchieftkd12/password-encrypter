const passwordService = require('../services/passwordService');

function list(req, res) {
  const entries = passwordService.getEntries(req.user.id);
  const logs = passwordService.getLogs(req.user.id);
  res.render('passwords', { title: 'My Passwords', entries, logs });
}

function showAdd(req, res) {
  res.render('add', { title: 'Add Password', error: null });
}

async function add(req, res) {
  const { label, username, password, masterKey } = req.body;
  try {
    await passwordService.addEntry(req.user, label, username, password, masterKey);
    res.redirect('/passwords');
  } catch (err) {
    res.render('add', { title: 'Add Password', error: err.message });
  }
}

function show(req, res, next) {
  try {
    const entry = passwordService.getEntry(req.user.id, req.params.id);
    res.render('view', { title: entry.label, entry, password: null, error: null });
  } catch (err) {
    res.status(404).render('error', { title: 'Error', message: err.message });
  }
}

async function decrypt(req, res) {
  let entry;
  try {
    entry = passwordService.getEntry(req.user.id, req.params.id);
    const password = await passwordService.decryptEntry(req.user, req.params.id, req.body.masterKey);
    res.render('view', { title: entry.label, entry, password, error: null });
  } catch (err) {
    if (!entry) {
      return res.status(404).render('error', { title: 'Error', message: err.message });
    }
    res.render('view', { title: entry.label, entry, password: null, error: err.message });
  }
}

function showEdit(req, res) {
  try {
    const entry = passwordService.getEntry(req.user.id, req.params.id);
    res.render('edit', { title: 'Edit Password', entry, error: null });
  } catch (err) {
    res.status(404).render('error', { title: 'Error', message: err.message });
  }
}

async function edit(req, res) {
  const { label, username, newPassword, masterKey } = req.body;
  let entry;
  try {
    entry = passwordService.getEntry(req.user.id, req.params.id);
    await passwordService.editEntry(req.user, req.params.id, label, username, newPassword, masterKey);
    res.redirect('/passwords/' + entry.id);
  } catch (err) {
    if (!entry) {
      return res.status(404).render('error', { title: 'Error', message: err.message });
    }
    res.render('edit', { title: 'Edit Password', entry, error: err.message });
  }
}

function remove(req, res) {
  try {
    passwordService.deleteEntry(req.user, req.params.id);
    res.redirect('/passwords');
  } catch (err) {
    res.status(404).render('error', { title: 'Error', message: err.message });
  }
}

module.exports = { list, showAdd, add, show, decrypt, showEdit, edit, remove };
