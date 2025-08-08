const pool = require("../services/db");

module.exports.getAllBadges = (callback) => {
  const SQLSTATMENT = `SELECT * FROM Badge`;
  pool.query(SQLSTATMENT, callback);
};

module.exports.awardBadge = (user_id, badge_id, callback) => {
  const SQLSTATMENT = `INSERT IGNORE INTO UserBadge (user_id, badge_id) VALUES (?, ?)`;
  pool.query(SQLSTATMENT, [user_id, badge_id], callback);
};

module.exports.getBadgesByUser = (user_id, callback) => {
  const SQLSTATMENT = `
    SELECT Badge.id, Badge.name, Badge.description
    FROM UserBadge
    JOIN Badge ON UserBadge.badge_id = Badge.id
    WHERE UserBadge.user_id = ?
  `;
  pool.query(SQLSTATMENT, [user_id], callback);
};

module.exports.checkCollectorBadge = (user_id, callback) => {
  const SQL = `
    SELECT COUNT(DISTINCT badge_id) AS badge_count
    FROM UserBadge
    WHERE user_id = ?
  `;

  pool.query(SQL, [user_id], (err, results) => {
    if (err) return callback(err, false); 
    const count = results[0].badge_count;

    if (count >= 5) {
      const checkSQL = `
        SELECT 1 FROM UserBadge WHERE user_id = ? AND badge_id = 8
      `;
      pool.query(checkSQL, [user_id], (err, badgeResults) => {
        if (err) return callback(err, false);

        if (badgeResults.length === 0) {
          module.exports.awardBadge(user_id, 8, (err) => {
            if (err) return callback(err, false);
            return callback(null, true);
          });
        } else {
          return callback(null, false);
        }
      });
    } else {
      return callback(null, false);
    }
  });
};