const express = require('express');
const router = express.Router();

const controller = require('../controllers/reviewController');
const jwtMiddleware = require('../middleware/jwtMiddleware')

router.get('/', controller.readAllReview);
router.post('/', controller.createReview);
router.get('/:id', jwtMiddleware.verifyToken, controller.readReviewById);
router.put('/:id', jwtMiddleware.verifyToken, controller.updateReviewById);
router.delete('/:id', jwtMiddleware.verifyToken, controller.deleteReviewById);
//Test
module.exports = router;