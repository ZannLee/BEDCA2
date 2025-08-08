const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('123', saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

const SQLSTATEMENT = `
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS UserGuild;
DROP TABLE IF EXISTS Guild;
DROP TABLE IF EXISTS UserBadge;
DROP TABLE IF EXISTS Reports;
DROP TABLE IF EXISTS UserRank;
DROP TABLE IF EXISTS Badge;
DROP TABLE IF EXISTS Vulnerabilities;
DROP TABLE IF EXISTS GuildRank;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Reviews;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE User (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  reputation INT DEFAULT 0
);


CREATE TABLE GuildRank (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  min_reputation INT NOT NULL
);

CREATE TABLE UserRank (
  user_id INT PRIMARY KEY,
  rank_id INT,
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (rank_id) REFERENCES GuildRank(id)
);

CREATE TABLE Vulnerabilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  points INT NOT NULL
);

CREATE TABLE Badge (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE UserBadge (
  user_id INT,
  badge_id INT,
  awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id),
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (badge_id) REFERENCES Badge(id)
);

CREATE TABLE Reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  vulnerability_id INT NOT NULL,
  status BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (vulnerability_id) REFERENCES Vulnerabilities(id)
);

CREATE TABLE Guild (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  reputation INT DEFAULT 0
);


CREATE TABLE UserGuild (
  user_id INT PRIMARY KEY,
  guild_id INT,
  FOREIGN KEY (user_id) REFERENCES User(id),
  FOREIGN KEY (guild_id) REFERENCES Guild(id)
);

CREATE TABLE Reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_amt INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Users
INSERT INTO User (username, email, password) VALUES
('admin', 'admin@gmail.com', '${hash}'),
('Lebron James', 'lbj@gmail.com', '${hash}'),
('Stephen Curry', 'sc@gmail.com', '${hash}'),
('Kevin Durant', 'kd@gmail.com', '${hash}'),
('Jason Tatum', 'jt@gmail.com', '${hash}'),
('Kawhi Leonard', 'kl@gmail.com', '${hash}');

-- Insert GuildRanks
INSERT INTO GuildRank (name, min_reputation) VALUES
('Novice', 0),
('Tracker', 100),
('Elite Hunter', 250),
('Master Hunter', 500);

-- Insert UserRanks
INSERT INTO UserRank (user_id, rank_id) VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 3),
(5, 1);

-- Insert Vulnerabilities
INSERT INTO Vulnerabilities (type, description, points) VALUES
('XSS', 'The homepage is vulnerable to reflected XSS', 50),
('SQL Injection', 'The login form is vulnerable to SQL Injection', 100),
('CSRF', 'The password change is vulnerable to CSRF', 150),
('Open Redirect', 'The site has an open redirect vulnerability', 20);

-- Insert Badges
INSERT INTO Badge (name, description) VALUES
('XSS Hunter', 'Found and reported an XSS flaw. Your actions made the site safer.'),
('SQL Slayer', 'Spotted an SQL injection risk. Thanks for guarding our database.'),
('CSRF Shield', 'Discovered a CSRF attack path. You helped block unauthorized actions.'),
('Critical Catch', 'Reported a vulnerability worth >= 100 points'),
('Bug Fixer', 'Closed your report after review. Thanks for following through.'),
('Guild Member', 'Joined a guild of fellow users. Welcome to the community!'),
('First Rank', 'You earned your very first rank. A great step forward!'),
('Collector', 'Unlocked 5 distinct badges. Keep up the great work!');

-- Insert UserBadges
INSERT INTO UserBadge (user_id, badge_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Insert Reports
INSERT INTO Reports (user_id, vulnerability_id, status) VALUES
(1, 1, 0),
(2, 2, 0),
(3, 3, 0),
(4, 4, 0),
(5, 1, 0);

-- Insert Guilds
INSERT INTO Guild (name, description, reputation) VALUES
('Hackers United', 'A syndicate of rogue coders united by digital rebellion', 0),
('Cyber Sentinels', 'Firewall-forged defenders standing between chaos and control', 0),
('Bug Busters', 'Relentlessly tracking and eliminating cyber threats', 0),
('Vuln Avengers', 'Assemble to hunt the nastiest vulnerabilities', 0),
('Code Crusaders', 'Protecting the digital realm one patch at a time', 0),
('Shadow Stalkers', 'Masters of stealth and digital infiltration', 0);


-- Insert UserGuild memberships
INSERT INTO UserGuild (user_id, guild_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO Reviews (review_amt, user_id) VALUES
  (1, 1),
  (2, 2),
  (3, 3),  
  (4, 4),  
  (5, 5);
`;


pool.query(SQLSTATEMENT, callback);
};
});