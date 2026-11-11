// stores the settings used to turn a master key into an encryption key
// (the master key itself is never saved)
class EncryptionKey {
  constructor(id, userId, salt) {
    this.id = id;
    this.userId = userId;
    this.salt = salt;
    this.iterations = 100000;
    this.algorithm = 'aes-256-gcm';
  }
}

module.exports = EncryptionKey;
