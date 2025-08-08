const pool = require("../services/db");

// Get top users ordered by reputation
function getTopUsers(limit = 10) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, username, reputation FROM User ORDER BY reputation DESC LIMIT ?`;
    pool.query(sql, [limit], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

// Get top guilds ordered by reputation
function getTopGuilds(limit = 10) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT g.id, g.name, COALESCE(SUM(u.reputation), 0) AS reputation
      FROM Guild g
      LEFT JOIN UserGuild ug ON g.id = ug.guild_id
      LEFT JOIN User u ON ug.user_id = u.id
      GROUP BY g.id, g.name
      ORDER BY reputation DESC
      LIMIT ?
    `;
    pool.query(sql, [limit], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

module.exports = {
  getTopUsers,
  getTopGuilds
};
