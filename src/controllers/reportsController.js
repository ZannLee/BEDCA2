const reportsModel = require("../models/reportsModel");
const userModel = require("../models/userModel");
const vulnerabilitiesModel = require("../models/vulnerabilitiesModel");
const badgeModel = require('../models/badgeModel');
const userRankModel = require('../models/userRankModel');

// QN 7 POST /report 
// Middleware: Validate input
const validateReportInput = (req, res, next) => {
  const { user_id, vulnerability_id } = req.body;
  if (!user_id || !vulnerability_id) {
    return res.status(400).send("Error: user_id or vulnerability_id is missing");
  }
  next();
};

// Middleware: Fetch user and attach to req
const fetchUserPost = (req, res, next) => {
  const { user_id } = req.body;
  userModel.getByIdReport(user_id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).send("User not found");
    req.user = results[0];
    next();
  });
};

// Middleware: Fetch vulnerability and attach to req
const fetchVulnerability = (req, res, next) => {
  const { vulnerability_id } = req.body;
  vulnerabilitiesModel.getByIdReport(vulnerability_id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).send("Vulnerability not found");
    req.vulnerability = results[0];
    next();
  });
};

// POST Handler: Create report and assign badges
const createNewReportHandler = (req, res) => {
  const { user_id, vulnerability_id } = req.body;
  const user = req.user;
  const vulnerability = req.vulnerability;
  const points = vulnerability.points;
  const vulnType = vulnerability.type.toLowerCase();
  const earnedBadges = [];

  reportsModel.insertReport({ user_id, vulnerability_id }, (err, insertResult) => {
    if (err) return res.status(500).json(err);

    reportsModel.updateUserReputation(user_id, points, (err) => {
      if (err) return res.status(500).json(err);

      userRankModel.updateUserRank(user_id, (err, results, awardedBadgeName) => {
        if (err) return res.status(500).json(err);

        if (awardedBadgeName) earnedBadges.push(awardedBadgeName);

        userRankModel.getUserRank(user_id, (err, results) => {
          if (err) return res.status(500).json(err);
          const newRank = results?.[0]?.rank;

          // Award vulnerability-specific badges
          if (vulnType === 'xss') {
            badgeModel.awardBadge(user_id, 1, () => {});
            earnedBadges.push("XSS Hunter");
          } else if (vulnType === 'sql injection') {
            badgeModel.awardBadge(user_id, 2, () => {});
            earnedBadges.push("SQL Slayer");
          } else if (vulnType === 'csrf') {
            badgeModel.awardBadge(user_id, 3, () => {});
            earnedBadges.push("CSRF Shield");
          }

          if (points >= 100) {
            badgeModel.awardBadge(user_id, 4, () => {});
            earnedBadges.push("Critical Catch");
          }

          badgeModel.checkCollectorBadge(user_id, (err, collectorAwarded) => {
            if (collectorAwarded) earnedBadges.push("Collector");

            const response = {
              id: insertResult.insertId,
              user_id,
              vulnerability_id,
              status: 0,
              user_reputation: user.reputation + points,
              badges_earned: earnedBadges
            };

            if (newRank) response.new_rank = newRank;

            return res.status(200).json(response);
          });
        });
      });
    });
  });
};


// QN 8 PUT /reports/:report_id
// Middleware: Validate input
const validateReportUpdate = (req, res, next) => {
  const { status } = req.body;
  if (status === undefined) {
    return res.status(400).send("Error: status missing");
  }
  next();
};

// Middleware: Check report exists
const fetchReport = (req, res, next) => {
  const report_id = req.params.report_id;
  reportsModel.reportExists(report_id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).send("Report not found");
    req.report = results[0];
    next();
  });
};

// Middleware: Check user exists
const fetchUserPut = (req, res, next) => {
  const user_id = res.locals.userId;
  userModel.getByIdReport(user_id, (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).send("User not found");
    req.user = results[0];
    next();
  });
};

// PUT Handler: Update report and award badges
const updateReportHandler = (req, res) => {
  const report_id = req.params.report_id;
  const { status } = req.body;
  const user_id = res.locals.userId;
  const earnedBadges = [];

  const vulnerabilityId = req.report.vulnerability_id;

  reportsModel.getVulnerabilityPoints(vulnerabilityId, (err, vulnResults) => {
    if (err) return res.status(500).json(err);
    if (vulnResults.length === 0) return res.status(404).send("Vulnerability not found");

    const points = vulnResults[0].points;

    reportsModel.updateReportStatus(report_id, status, user_id, (err) => {
      if (err) return res.status(500).json(err);

      reportsModel.updateUserReputation(user_id, points, (err) => {
        if (err) return res.status(500).json(err);

        userRankModel.updateUserRank(user_id, (err, results, awardedBadgeName) => {
          if (err) return res.status(500).json(err);

          if (awardedBadgeName) earnedBadges.push(awardedBadgeName);

          userRankModel.getUserRank(user_id, (err, results) => {
            if (err) return res.status(500).json(err);
            const newRank = results?.[0]?.rank;

            if (parseInt(status) === 1) {
              badgeModel.awardBadge(user_id, 5, () => {
                earnedBadges.push("Bug Fixer");

                badgeModel.checkCollectorBadge(user_id, (err, collectorAwarded) => {
                  if (collectorAwarded) earnedBadges.push("Collector");

                  const response = {
                    id: parseInt(report_id),
                    status: parseInt(status),
                    closer_id: user_id,
                    user_reputation: req.user.reputation + points,
                    badges_earned: earnedBadges
                  };

                  if (newRank) response.new_rank = newRank;

                  return res.status(200).json(response);
                });
              });
            } else {
              const response = {
                id: parseInt(report_id),
                status: parseInt(status),
                closer_id: user_id,
                user_reputation: req.user.reputation + points,
                badges_earned: earnedBadges
              };

              if (newRank) response.new_rank = newRank;

              return res.status(200).json(response);
            }
          });
        });
      });
    });
  });
};



//GET /reports/open
const getAllOpenReportsHandler = (req, res) => {
  reportsModel.getOpenReports((err, results) => {
    if (err) {
      console.error("❌ Error fetching open reports:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
};

// GET /reports/stats/:user_id
const getUserBugStats = (req, res) => {
  const user_id = req.params.user_id;

  reportsModel.getUserBugStats(user_id, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch stats" });
    res.json(results[0]);
  });
};


module.exports = {
  // POST
  validateReportInput,
  fetchUserPost,
  fetchVulnerability,
  createNewReportHandler,

  // PUT
  validateReportUpdate,
  fetchReport,
  fetchUserPut,
  updateReportHandler,

  //GET
  getAllOpenReportsHandler,
  getUserBugStats
};
