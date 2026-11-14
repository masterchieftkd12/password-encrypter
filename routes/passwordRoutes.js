const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const { requireLogin } = require('../middleware/auth');

// all of these pages need the user to be logged in
router.use(requireLogin);

router.get('/', passwordController.list);
router.get('/add', passwordController.showAdd);
router.post('/add', passwordController.add);
router.get('/:id', passwordController.show);
router.post('/:id/decrypt', passwordController.decrypt);
router.get('/:id/edit', passwordController.showEdit);
router.post('/:id/edit', passwordController.edit);
router.post('/:id/delete', passwordController.remove);

module.exports = router;
