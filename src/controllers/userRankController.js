const userRankModel = require('../models/userRankModel');

// GET /user/id/rank
module.exports.getUserRank = (req, res) => {
  const userId = req.params.id;
  userRankModel.getUserRank(userId, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch rank" });
    if (results.length === 0) return res.status(404).json({ message: "Rank not found" });
    return res.status(200).json({ rank: results[0].rank });
  });
};