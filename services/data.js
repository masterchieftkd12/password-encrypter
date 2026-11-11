// No database, so all objects are kept in these arrays while the server runs.
const data = {
  users: [],
  entries: [],
  keys: [],
  logs: [],
  sessions: []
};

let nextId = 1;

function getNextId() {
  return nextId++;
}

module.exports = { data, getNextId };
