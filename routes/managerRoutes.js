const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { requireManager } = require('../middleware/auth');

router.get('/', requireManager, managerController.dashboard);

module.exports = router;