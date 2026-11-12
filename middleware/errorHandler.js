function notFound(req, res) {
  res.status(404).render('error', { title: 'Not Found', message: 'Page not found.' });
}

function errorHandler(err, req, res, next) {
  console.log('Error:', err.message);
  res.status(500).render('error', { title: 'Error', message: 'Something went wrong. Please try again.' });
}

module.exports = { notFound, errorHandler };