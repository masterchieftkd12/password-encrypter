const SESSION_LENGTH = 30 * 60 * 1000; // 30 minutes

class Session {
  constructor(id, userId) {
    this.id = id;
    this.userId = userId;
    this.loginTime = new Date();
    this.expiryTime = new Date(Date.now() + SESSION_LENGTH);
    this.status = 'active'; // "active", "expired" or "logged out"
  }

  isValid() {
    if (this.status !== 'active') {
      return false;
    }
    if (new Date() > this.expiryTime) {
      this.status = 'expired';
      return false;
    }
    return true;
  }
}

module.exports = Session;
