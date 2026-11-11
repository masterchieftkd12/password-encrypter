const crypto = require('crypto');

// Hash the master key with scrypt so we can check it later without saving it.
function hashMasterKey(masterKey) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(masterKey, salt, 64, (err, hash) => {
      if (err) return reject(err);
      resolve(salt + ':' + hash.toString('hex'));
    });
  });
}

// Check if a master key matches the saved hash.
function checkMasterKey(masterKey, savedHash) {
  return new Promise((resolve, reject) => {
    const [salt, hash] = savedHash.split(':');
    crypto.scrypt(masterKey, salt, 64, (err, newHash) => {
      if (err) return reject(err);
      resolve(newHash.toString('hex') === hash);
    });
  });
}

// Turn the master key into a 32 byte (256 bit) key using PBKDF2.
function makeKey(masterKey, keyInfo) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(masterKey, keyInfo.salt, keyInfo.iterations, 32, 'sha256', (err, key) => {
      if (err) return reject(err);
      resolve(key);
    });
  });
}

// Encrypt text with AES-256-GCM. Returns "iv:tag:encryptedText".
async function encrypt(text, masterKey, keyInfo) {
  const key = await makeKey(masterKey, keyInfo);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(keyInfo.algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return iv.toString('hex') + ':' + tag + ':' + encrypted;
}

// Decrypt text. If the master key is wrong, decipher.final() throws an error.
async function decrypt(encryptedText, masterKey, keyInfo) {
  const [iv, tag, encrypted] = encryptedText.split(':');
  const key = await makeKey(masterKey, keyInfo);
  const decipher = crypto.createDecipheriv(keyInfo.algorithm, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  let text = decipher.update(encrypted, 'hex', 'utf8');
  text += decipher.final('utf8');
  return text;
}

module.exports = { hashMasterKey, checkMasterKey, encrypt, decrypt };
