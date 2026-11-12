function home(req, res) {
  res.render('index', { title: 'Home' });
}

function about(req, res) {
  res.render('about', { title: 'How It Works' });
}

module.exports = { home, about };
