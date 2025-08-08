const express = require('express');
const router = express.Router();

const controller = require('../controllers/vulnerabilitiesController')
const jwtMiddleware = require('../middleware/jwtMiddleware');

router.post('/', jwtMiddleware.verifyToken, controller.createNewVulnerabilities);
router.get('/', controller.readAllVulnerabilities);
router.delete('/:id', jwtMiddleware.verifyToken, controller.deleteVulnerability);

module.exports = router;