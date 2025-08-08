const pool = require("../services/db");
const badgeModel = require("../models/badgeModel");

const FIRST_RANK_BADGE_ID = 7; // your badge ID

module.exports.updateUserRank = (user_id, callback) => {
  const GET_RANK_SQL = `
    SELECT id FROM GuildRank
    WHERE min_reputation <= (SELECT reputation FROM User WHERE id = ?)
    ORDER BY min_reputation DESC
    LIMIT 1
  `;

  pool.query(GET_RANK_SQL, [user_id], (err, rankResults) => {
    if (err) return callback(err);

    if (rankResults.length === 0) return callback(null);

    const rank_id = rankResults[0].id;

    // Check if user already has a rank
    const CHECK_EXISTING_SQL = `SELECT * FROM UserRank WHERE user_id = ?`;
    pool.query(CHECK_EXISTING_SQL, [user_id], (err, existing) => {
      if (err) return callback(err);

      const isFirstRank = existing.length === 0;

      const UPSERT_SQL = `
        INSERT INTO UserRank (user_id, rank_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE rank_id = VALUES(rank_id)
      `;

      pool.query(UPSERT_SQL, [user_id, rank_id], (err, results) => {
        if (err) return callback(err);

        console.log(`UserRank updated for user_id=${user_id} with rank_id=${rank_id}`);

        if (isFirstRank) {
          badgeModel.awardBadge(user_id, FIRST_RANK_BADGE_ID, (badgeErr) => {
            if (badgeErr) {
              console.error("Failed to award first rank badge:", badgeErr);
              return callback(null, results, null);
            } else {
              console.log("First Rank badge awarded!");
              return callback(null, results, "First Rank"); // badge awarded!
            }
          });
        } else {
          return callback(null, results, null);
        }
      });
    });
  });
};




module.exports.getUserRank = (user_id, callback) => {
const SQLSTATMENT = `
  SELECT GR.name AS \`rank\`
  FROM UserRank UR
  JOIN GuildRank GR ON UR.rank_id = GR.id
  WHERE UR.user_id = ?
`;
  pool.query(SQLSTATMENT, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching user rank:", err);
      return callback(err);
    }
    if (results.length === 0) {
      console.log("No rank assigned yet for user_id:", user_id);
      return callback(null, []);
    }
    return callback(null, results);
  });
};


