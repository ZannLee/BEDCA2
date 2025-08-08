const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
        SELECT * FROM Vulnerabilities;
    `;
    pool.query(SQLSTATMENT, callback);
}

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
        INSERT INTO Vulnerabilities (type, description, points)
        VALUES (?, ?, ?);
    `;
    const VALUES = [data.type, data.description, data.points];
    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.getByIdReport = (id, callback) =>
{
    const SQLSTATMENT = `
        SELECT * FROM Vulnerabilities
        WHERE id = ?;
    `;
    const VALUES = [id];
    pool.query(SQLSTATMENT, VALUES, callback);
}

// Delete reports that reference the vulnerability
module.exports.deleteReportsByVulnerabilityId = (vulnerabilityId, callback) => {
  const SQLSTATMENT = 'DELETE FROM reports WHERE vulnerability_id = ?';
  pool.query(SQLSTATMENT, [vulnerabilityId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Delete vulnerability by id
module.exports.deleteVulnerabilityById = (vulnerabilityId, callback) => {
  const SQLSTATMENT = 'DELETE FROM Vulnerabilities WHERE id = ?';
  pool.query(SQLSTATMENT, [vulnerabilityId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
