class PasswordEntry {
  constructor(id, userId, label, username, encryptedPassword) {
    this.id = id;
    this.userId = userId;
    this.label = label;
    this.username = username;
    this.encryptedPassword = encryptedPassword;
    this.dateCreated = new Date();
  }
}

module.exports = PasswordEntry;
