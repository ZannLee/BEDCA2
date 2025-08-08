const pool = require("../services/db");

module.exports.insertReport = (data, callback) => 
{
    const SQLSTATMENT = `
        INSERT INTO Reports (user_id, vulnerability_id, status)
        VALUES (?, ?, 0);
    `;
    const VALUES = [data.user_id, data.vulnerability_id];
    pool.query(SQLSTATMENT, VALUES, callback);
},  

module.exports.getVulnerabilityPoints = (vulnerability_id, callback) => 
{
    const SQLSTATMENT = `
        SELECT points 
        FROM Vulnerabilities 
        WHERE id = ?
    `;
    pool.query(SQLSTATMENT, [vulnerability_id], callback);
}

module.exports.updateUserReputation = (user_id, points, callback) => 
{
    const SQLSTATMENT = `
        UPDATE User SET reputation = reputation + ? 
        WHERE id = ?
    `;
    pool.query(SQLSTATMENT, [points, user_id], callback);
},

  module.exports.reportExists = (report_id, callback) => 
{
    const SQLSTATMENT = `
        SELECT * FROM Reports
        WHERE id = ?
    `;
    pool.query(SQLSTATMENT, [report_id], callback);
},

  module.exports.updateReportStatus = (report_id, status, user_id, callback) => 
{
    const SQLSTATMENT = `
        UPDATE Reports SET status = ?, user_id = ? 
        WHERE id = ?
    `;
    pool.query(SQLSTATMENT, [status, user_id, report_id], callback);
}

  module.exports.getOpenReports = (callback) => 
{
  const SQLSTATMENT = `
    SELECT 
      Reports.id,
      Reports.user_id,
      User.username,
      Reports.vulnerability_id,
      Vulnerabilities.type AS vulnerability_type,
      Reports.status
    FROM Reports
    JOIN User ON Reports.user_id = User.id
    JOIN Vulnerabilities ON Reports.vulnerability_id = Vulnerabilities.id
    WHERE Reports.status = 0
  `;
  pool.query(SQLSTATMENT, callback);
};

module.exports.getUserBugStats = (user_id, callback) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM Reports WHERE user_id = ?) AS bugsReported,
      (SELECT COUNT(*) FROM Reports WHERE status = 1 AND user_id = ?) AS bugsClosed;
  `;
  pool.query(sql, [user_id, user_id], callback);
};
