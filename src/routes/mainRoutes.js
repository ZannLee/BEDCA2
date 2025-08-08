const express = require('express');
const router = express.Router();

const reportsController = require('../controllers/reportsController')
const userController = require('../controllers/userController')
const vulnerabilitiesController = require('../controllers/vulnerabilitiesController')
const userRankController = require('../controllers/userRankController')
const badgeController = require('../controllers/badgeController')
const guildController = require('../controllers/guildController')
const leaderboardController = require ('../controllers/leaderboardController')
const exampleController = require('../controllers/exampleController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const bcryptMiddleware = require('../middleware/bcryptMiddleware');
const reviewController = require('../controllers/reviewController')

const reportsRoutes = require('./reportsRoutes');
const userRoutes = require('./userRoutes');
const vulnerabilitiesRoutes = require('./vulnerabilitiesRoutes');
const userRankRoutes = require('./userRankRoutes');
const badgeRoutes = require('./badgeRoutes');
const guildRoutes = require('./guildRoutes');
const leaderboardRoutes = require('./leaderboardRoutes');
const reviewRoutes = require('./reviewRoutes');

router.use("/vulnerabilities", vulnerabilitiesRoutes);
router.use("/reports", reportsRoutes);
router.use("/users", userRoutes);
router.use("/users", userRankRoutes);
router.use("/badges", badgeRoutes);
router.use("/guilds", guildRoutes)
router.use("/leaderboard", leaderboardRoutes)
router.use("/reviews", reviewRoutes);

//jwt & bycrypt routes
router.post("/login",
    userController.login,
    bcryptMiddleware.comparePassword,
    jwtMiddleware.generateToken,
    jwtMiddleware.sendToken);

router.post("/register",
    userController.checkUsernameOrEmailExist,
    bcryptMiddleware.hashPassword,
    userController.register,
    jwtMiddleware.generateToken,
    jwtMiddleware.sendToken
);

router.post("/jwt/generate",
    exampleController.preTokenGenerate,
    jwtMiddleware.generateToken,
    exampleController.beforeSendToken,
    jwtMiddleware.sendToken
);

router.get("/jwt/verify", jwtMiddleware.verifyToken, exampleController.showTokenVerified);
router.post("/bcrypt/compare", exampleController.preCompare, bcryptMiddleware.comparePassword, exampleController.showCompareSuccess);
router.post("/bcrypt/hash", bcryptMiddleware.hashPassword, exampleController.showHashing);

module.exports = router;