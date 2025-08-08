const userId = Number(localStorage.getItem("userId"));
const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', () => {
  fetchAllVulnerabilities();
});

function fetchAllVulnerabilities() {
  fetch('http://localhost:3000/api/vulnerabilities')
    .then(response => response.json())
    .then(data => {
      const vulnList = document.getElementById("vulnerabilitiesList");
      vulnList.innerHTML = "";

      if (Array.isArray(data) && data.length > 0) {
        data.forEach(vuln => {
          const vulnCard = document.createElement("div");
          vulnCard.className = "vulnerability-card my-3";

          vulnCard.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">${vuln.type || "Unnamed Vulnerability"}</h5>
              <p class="card-text">
                ${vuln.description || "No description available"}<br>
                Points: ${vuln.points || "Unknown"}<br>
                Vulnerability ID: ${vuln.id}
              </p>
              <div class="mt-3">
                <button class="btn btn-primary report-btn" data-vuln-id="${vuln.id}">
                  Report This Vulnerability
                </button>
                ${userId === 1 ? `
                  <button class="btn btn-danger ms-2 delete-btn" data-vuln-id="${vuln.id}">
                    Delete
                  </button>` : ''}
              </div>
            </div>
          `;

          vulnList.appendChild(vulnCard);
        });

        // Add event listeners
        document.querySelectorAll('.report-btn').forEach(btn =>
          btn.addEventListener('click', postReport)
        );

        if (userId === 1) {
          document.querySelectorAll('.delete-btn').forEach(btn =>
            btn.addEventListener('click', deleteVulnerability)
          );
        }
      } else {
        vulnList.textContent = "No vulnerabilities found.";
      }
    })
    .catch(err => {
      const vulnList = document.getElementById("vulnerabilitiesList");
      vulnList.textContent = `Error fetching vulnerabilities: ${err}`;
      console.error(err);
    });
}

function postReport(event) {
  const button = event.currentTarget;
  const vulnerabilityId = button.getAttribute('data-vuln-id');

  button.disabled = true;
  button.textContent = "Submitting...";

  fetch('http://localhost:3000/api/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      user_id: userId,
      vulnerability_id: parseInt(vulnerabilityId)
    })
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(msg => { throw new Error(msg); });
      }
      return response.json();
    })
    .then(data => {
      button.textContent = "Reported!";
      button.classList.remove('btn-primary');
      button.classList.add('btn-success');

      const badges = data.badges_earned?.length
        ? data.badges_earned.join(', ')
        : 'None';

      alert(`Vulnerability ${vulnerabilityId} reported!\nBadges earned: ${badges}`);
    })
    .catch(err => {
      console.error("Report failed:", err);
      button.disabled = false;
      button.textContent = "Report This Vulnerability";
      alert("Error submitting report:\n" + err.message);
    });
}

function deleteVulnerability(event) {
  const button = event.currentTarget;
  const vulnerabilityId = button.getAttribute('data-vuln-id');

  if (!confirm(`Are you sure you want to delete Vulnerability ID ${vulnerabilityId}?`)) {
    return;
  }

  fetch(`http://localhost:3000/api/vulnerabilities/${vulnerabilityId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then(response => {
      if (!response.ok) {
        return response.text().then(msg => { throw new Error(msg); });
      }
      return response.text();
    })
    .then(() => {
      alert(`Vulnerability ${vulnerabilityId} deleted successfully.`);
      fetchAllVulnerabilities();
    })
    .catch(err => {
      console.error("Delete failed:", err);
      alert("Error deleting vulnerability:\n" + err.message);
    });
}
