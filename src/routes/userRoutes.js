const express = require('express');
const router = express.Router();

const controller = require('../controllers/userController')
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.post('/', controller.createNewUser);
router.get('/', controller.readAllUser);
router.get('/:id', jwtMiddleware.verifyToken, controller.readUserById)
router.post('/reset-password', controller.resetPassword);
router.put(
  '/:id',
  jwtMiddleware.verifyToken,
  controller.validateUserUpdate,
  controller.checkUsernameConflict,
  controller.performUserUpdate,
  controller.returnUpdatedUser
);

module.exports = router;
