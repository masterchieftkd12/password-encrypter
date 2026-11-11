const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const pageRoutes = require('./routes/pageRoutes');
const userRoutes = require('./routes/userRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const managerRoutes = require('./routes/managerRoutes');

const logger = require('./middleware/logger');
const { securityHeaders } = require('./middleware/security');
const { loadUser } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const userService = require('./services/userService');

const app = express();
const PORT = 3000;

// views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static files (css, images, js)
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(logger);
app.use(securityHeaders);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(loadUser);

// routes
app.use('/', pageRoutes);
app.use('/', userRoutes);
app.use('/passwords', passwordRoutes);
app.use('/manager', managerRoutes);

// error handling
app.use(notFound);
app.use(errorHandler);

// create the manager account, then start the server
userService.createManager()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Could not start the server:', err);
  });
