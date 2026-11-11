class User {
  constructor(id, name, email, masterKeyHash, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.masterKeyHash = masterKeyHash;
    this.role = role; // "user" or "manager"
  }
}

module.exports = User;
