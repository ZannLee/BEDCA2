const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");

router.get("/users", leaderboardController.getUserLeaderboard);
router.get("/guilds", leaderboardController.getGuildLeaderboard);

module.exports = router;
