const guildModel = require("../models/guildModel");
const badgeModel = require("../models/badgeModel")

module.exports.getGuildMembers = (req, res) => {
  const guildId = req.params.id;
  guildModel.getGuildMembers(guildId, (err, results) => {
    if (err) {
      console.error("Error fetching guild members:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
};

module.exports.joinGuild = (req, res) => {
  const guildId = req.params.id;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  guildModel.addUserToGuild(user_id, guildId, (err) => {
    if (err) {
      console.error("Error joining guild:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const earnedBadges = [];
    const JOIN_GUILD_BADGE_ID = 6;

    // Award "Guild Member" badge
    badgeModel.awardBadge(user_id, JOIN_GUILD_BADGE_ID, () => {});
    earnedBadges.push("Guild Member");

    // Optionally check and award "Collector" badge
    badgeModel.checkCollectorBadge(user_id, (err, collectorAwarded) => {
      if (collectorAwarded) earnedBadges.push("Collector");

      return res.status(201).json({
        message: "User joined guild and badges awarded",
        user_id,
        guild_id: guildId,
        badges_earned: earnedBadges
      });
    });
  });
};

module.exports.getAllGuilds = (req, res) => {
  guildModel.getAllGuilds((err, results) => {
    if (err) return res.status(500).json({ error: "Failed to retrieve guilds" });
    return res.status(200).json(results);
  });
}

// Quit Guild
exports.quitGuild = (req, res) => {
  const userId = req.params.user_id;

  guildModel.removeUserFromGuild(userId, (err) => {
    if (err) {
      console.error('Error quitting guild:', err);
      return res.status(500).json({ error: 'Failed to quit guild' });
    }
    res.json({ message: 'You have left your guild.' });
  });
};

// Delete Guild (admin)
exports.deleteGuild = (req, res) => {
  const guildId = Number(req.params.id);
  if (!guildId) {
    return res.status(400).json({ error: 'Invalid guild ID' });
  }
  guildModel.deleteGuildById(guildId, (err, affectedRows) => {
    if (err) {
      console.error('Error deleting guild:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Guild not found' });
    }
    return res.status(200).json({ message: 'Guild deleted successfully' });
  });
}

