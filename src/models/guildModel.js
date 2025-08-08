const pool = require("../services/db");

// Get members of a guild, sorted by reputation
exports.getGuildMembers = (guildId, callback) => {
  const SQLSTATMENT = `
    SELECT u.id, u.username, u.reputation
    FROM User u
    JOIN UserGuild ug ON u.id = ug.user_id
    WHERE ug.guild_id = ?
    ORDER BY u.reputation DESC
  `;
  pool.query(SQLSTATMENT, [guildId], callback);
};

// Add user to a guild
exports.addUserToGuild = (userId, guildId, callback) => {
  const SQLSTATMENT = `
    INSERT INTO UserGuild (user_id, guild_id)
    VALUES (?, ?)
  `;
  pool.query(SQLSTATMENT, [userId, guildId], callback);
};


exports.getAllGuilds = (callback) => {
  const SQLSTATEMENT = `
  SELECT 
    g.id,
    g.name,
    g.description,
    COUNT(ug.user_id) AS member_count,
    GROUP_CONCAT(u.username ORDER BY u.reputation DESC SEPARATOR ', ') AS members,
    GROUP_CONCAT(u.id SEPARATOR ',') AS member_ids
  FROM Guild g
  LEFT JOIN UserGuild ug ON g.id = ug.guild_id
  LEFT JOIN User u ON ug.user_id = u.id
  GROUP BY g.id, g.name, g.description
  ORDER BY g.id ASC;
  `;

  pool.query(SQLSTATEMENT, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

exports.removeUserFromGuild = (userId, callback) => {
  const SQLSTATMENT = `DELETE FROM UserGuild WHERE user_id = ?`;
  pool.query(SQLSTATMENT, [userId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

exports.deleteGuildById = (guildId, callback) => {
  // Step 1: Delete rows from userguild where guild_id = ?
  const deleteUserGuildSQL = 'DELETE FROM userguild WHERE guild_id = ?';
  pool.query(deleteUserGuildSQL, [guildId], (err) => {
    if (err) return callback(err);

    // Step 2: Delete the guild itself
    const deleteGuildSQL = 'DELETE FROM Guild WHERE id = ?';
    pool.query(deleteGuildSQL, [guildId], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  });
};