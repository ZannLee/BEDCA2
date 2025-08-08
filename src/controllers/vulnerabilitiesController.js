const vulnerabilitiesModel = require("../models/vulnerabilitiesModel.js");

module.exports.readAllVulnerabilities = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllVulnerabilities:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    vulnerabilitiesModel.selectAll(callback);
}

module.exports.createNewVulnerabilities = (req, res, next) => {
    const { type, description, points } = req.body;

    // Validate request body
    if (!type || !description || !points) {
        return res.status(400).send("Error: type, description or points is undefined");
    }

    const data = { type, description, points };

    vulnerabilitiesModel.insertSingle(data, (error, results) => {
        if (error) {
            console.error("Error in createNewVulnerabilities:", error);
            return res.status(500).json(error);
        }

        // Return only the newly inserted ID
        return res.status(201).json({ id: results.insertId });
    });
};

module.exports.deleteVulnerability = (req, res) => {
  const vulnerabilityId = req.params.id;

  vulnerabilitiesModel.deleteReportsByVulnerabilityId(vulnerabilityId, (err) => {
    if (err) {
      console.error("Error deleting reports:", err);
      return res.status(500).json({ error: "Error deleting related reports" });
    }

    vulnerabilitiesModel.deleteVulnerabilityById(vulnerabilityId, (err, results) => {
      if (err) {
        console.error("Error deleting vulnerability:", err);
        return res.status(500).json({ error: "Error deleting vulnerability" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Vulnerability not found" });
      }

      res.status(200).json({ message: "Vulnerability and related reports deleted successfully" });
    });
  });
};