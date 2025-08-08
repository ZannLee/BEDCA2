const badgeModel = require('../models/badgeModel');

// Get all badges
const readAllBadges = (req, res) => {
  badgeModel.getAllBadges((err, results) => {
    if (err) {
      console.error("Error fetching all badges:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json(results);
  });
};

// Get badges of a specific user
const getUserBadges = (req, res) => {
  const user_id = req.params.id;

  badgeModel.getBadgesByUser(user_id, (err, results) => {
    if (err) {
      console.error("Error fetching badges:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json(results);
  });
};

module.exports = {
  readAllBadges,
  getUserBadges
};
