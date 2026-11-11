class EncryptionLog {
  constructor(id, userId, entryId, action, success) {
    this.id = id;
    this.userId = userId;
    this.entryId = entryId;
    this.action = action; // "encrypt", "decrypt", "edit" or "delete"
    this.timestamp = new Date();
    this.success = success;
  }
}

module.exports = EncryptionLog;
