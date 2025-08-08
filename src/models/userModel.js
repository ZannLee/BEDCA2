const pool = require('../services/db');
const bcrypt = require('bcrypt');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
        SELECT * FROM User;
    `;
    pool.query(SQLSTATMENT, callback);
}

//Updated insertSingle
module.exports.insertSingle = (data, callback) =>
{
    const {username, email, password} = data;
    const SQLSTATMENT = `
        INSERT INTO User (username, email, password)
        VALUES (?, ?, ?);
        SELECT * FROM User WHERE id = LAST_INSERT_ID();
    `;
    const VALUES = [username, email, password];
    pool.query(SQLSTATMENT, VALUES, callback);
}



module.exports.getByUsername = (username, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM User WHERE username = ?;
    `;
    const VALUES = [username];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.getById = (id, callback) => {
    const SQLSTATEMENT = `
        SELECT id, username, reputation
        FROM User
        WHERE id = ?;
    `;
    const VALUES = [id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
        SELECT * FROM User
        WHERE id = ?;
    `;
    const VALUES = [data.id];
    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
        UPDATE User 
        SET username = ?, reputation = ?
        WHERE id = ?;
    `;
    const VALUES = [data.username, data.reputation, data.id];
    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.getByIdReport = (id, callback) =>
{
    const SQLSTATMENT = `
        SELECT * FROM User
        WHERE id = ?;
    `;
    const VALUES = [id];
    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.checkUsernameOrEmailExist = (data, callback) => {
    const SQLSTATMENT = `
        SELECT id FROM User
        WHERE username = ? OR email = ?;
    `;
    const VALUES = [data.username, data.email];
    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.login = (data, callback) => {
        const SQLSTATMENT = `
        SELECT id, password FROM User
        WHERE username = ?;
    `;
    const VALUES = [data.username];
    pool.query(SQLSTATMENT, VALUES, callback);
}

exports.getUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM User WHERE username = ?';
  pool.query(query, [username], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

exports.updateUserPassword = (userId, newPassword, callback) => {
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    const query = 'UPDATE User SET password = ? WHERE id = ?';
    pool.query(query, [hashedPassword, userId], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  });
};
