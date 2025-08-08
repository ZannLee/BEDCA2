const leaderboardModel = require("../models/leaderboardModel");

// GET /leaderboard/users
async function getUserLeaderboard(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const users = await leaderboardModel.getTopUsers(limit);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user leaderboard" });
  }
}

// GET /leaderboard/guilds
async function getGuildLeaderboard(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const guilds = await leaderboardModel.getTopGuilds(limit);
    res.json(guilds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch guild leaderboard" });
  }
}

module.exports = {
  getUserLeaderboard,
  getGuildLeaderboard
};
