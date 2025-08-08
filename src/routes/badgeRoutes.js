const express = require('express');
const router = express.Router();
const controller = require('../controllers/badgeController')
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.get('/', controller.readAllBadges)
router.get('/:id', jwtMiddleware.verifyToken, controller.getUserBadges);

module.exports = router;