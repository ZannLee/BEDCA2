const express = require('express');
const router = express.Router();
const controller = require('../controllers/userRankController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.get('/:id/rank', jwtMiddleware.verifyToken, controller.getUserRank);

module.exports = router;
