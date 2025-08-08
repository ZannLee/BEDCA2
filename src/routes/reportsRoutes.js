const express = require('express');
const router = express.Router();

const controller = require('../controllers/reportsController')
const jwtMiddleware = require('../middleware/jwtMiddleware')

router.post(
  '/',
  jwtMiddleware.verifyToken,
  controller.validateReportInput,
  controller.fetchUserPost,
  controller.fetchVulnerability,
  controller.createNewReportHandler
);

router.put(
  '/:report_id',
  jwtMiddleware.verifyToken,
  controller.validateReportUpdate,
  controller.fetchReport,
  controller.fetchUserPut,
  controller.updateReportHandler
);

router.get("/open", controller.getAllOpenReportsHandler);

router.get('/stats/:user_id', jwtMiddleware.verifyToken, controller.getUserBugStats);


module.exports = router;