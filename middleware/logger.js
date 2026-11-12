// prints every request in the terminal
function logger(req, res, next) {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
}

module.exports = logger;