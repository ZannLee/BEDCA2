const userModel = require("../models/userModel");

//QN 2 GET /users
readAllUser = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUser:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    userModel.selectAll(callback);
}

// QN 1 POST /users
createNewUser = (req, res, next) =>
{
    // res.send("createNewUser");
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
        res.status(400).json({Error: `Unacceptable input`});
    } else {

        const data = {
            username: username,
            email: email,
            password: password
        }

        const callback = (error, results, fields) => {
            if (error) {
                console.error("Error createNewUser:", error);
                res.status(500).json(error);
            } else {
                res.status(201).json({
                    message: `User created successfully`,
                    user: results[1][0]
                });
            }
        }
        userModel.insertSingle(data, callback);
    }
}


//QN 3 GET /users/{id}
readUserById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readUserById:", error);
            res.status(500).json(error);

        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(200).json(results[0]);
        }
    }
    userModel.selectById(data, callback);
}


//QN 4 PUT /users/{id}
const validateUserUpdate = (req, res, next) => {
  const { username, reputation } = req.body;
  if (username === undefined || reputation === undefined) {
    return res.status(400).json({ message: "Error: username or reputation is undefined" });
  }
  next();
};

const checkUsernameConflict = (req, res, next) => {
  const { username } = req.body;
  const userId = req.params.id;
  userModel.getByUsername(username, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0 && results[0].id != userId) {
      return res.status(409).send("Error: username already exists");
    }
    next();
  });
};

const performUserUpdate = (req, res, next) => {
  const data = {
    id: req.params.id,
    username: req.body.username,
    reputation: req.body.reputation
  };
  userModel.updateById(data, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  });
};

const returnUpdatedUser = (req, res) => {
  const userId = req.params.id;
  userModel.getById(userId, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found after update" });
    }
    res.status(200).json(results[0]);
  });
};

// Lab6 Basic Ex Task1
function checkUsernameOrEmailExist(req, res, next) {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ Error: `Unacceptable input` });
    }

    const data = { username, email };

    userModel.checkUsernameOrEmailExist(data, (error, results) => {
        if (error) {
            return res.status(500).json(error);
        } else if (results.length > 0) {
            return res.status(409).json({ message: "Username or email already exists" });
        } else {
            next();
        }
    });
}

function register(req, res, next) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ Error: `Unacceptable input` });
    }

    const data = {
        username,
        email,
        password: res.locals.hash
    };

    userModel.insertSingle(data, (error, results, fields) => {
        if (error) {
            console.error("Error createNewUser:", error);
            return res.status(500).json(error);
        } else {
            return res.status(200).json({
                message: `User ${username} created successfully.`
            });
        }
    });
}

// Lab6 Basic Ex Task2
function login(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ Error: `Unacceptable input` });
    }

    const data = { username };

    userModel.login(data, (error, results) => {
        if (error) {
            return res.status(500).json(error);
        } else if (results.length < 1) {
            return res.status(404).json({ message: "User not found" });
        } else {
            res.locals.userId = results[0].id;
            res.locals.hash = results[0].password;
            next();
        }
    });
}

function resetPassword(req, res) {
  const { username, email, newPassword } = req.body;

  if (!username || !email || !newPassword) {
    return res.status(400).json({ message: 'Missing username, email, or new password.' });
  }

  // Look up by username
  userModel.getUserByUsername(username, (err, user) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error.' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check email matches
    if (user.email !== email) {
      return res.status(401).json({ message: 'Username and email do not match.' });
    }

    // Proceed to update password
    userModel.updateUserPassword(user.id, newPassword, (err) => {
      if (err) {
        console.error('Password update error:', err);
        return res.status(500).json({ message: 'Failed to update password.' });
      }
      return res.status(200).json({ message: 'Password updated successfully.' });
    });
  });
}



module.exports = {
  createNewUser,
  readAllUser,
  readUserById,
  validateUserUpdate,
  checkUsernameConflict,
  performUserUpdate,
  returnUpdatedUser,
  login,
  register,
  checkUsernameOrEmailExist,
  resetPassword
};
