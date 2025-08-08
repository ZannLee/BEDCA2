const userId = Number(localStorage.getItem("userId"));
const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', () => {
  fetchOpenReports();
});

function fetchOpenReports() {
  fetch('http://localhost:3000/api/reports/open')
    .then(res => res.json())
    .then(data => renderReports(data))
    .catch(err => console.error('Error fetching open reports:', err));
}

function renderReports(reports) {
  const container = document.getElementById('openReportsList');
  container.innerHTML = '';

  if (!Array.isArray(reports) || reports.length === 0) {
    container.innerHTML = '<div class="col text-center">No open reports found.</div>';
    return;
  }

  reports.forEach(report => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4';

    col.innerHTML = `
      <div class="report-card card h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-primary">🔍 Vulnerability: ${report.vulnerability_type}</h5>
          <p class="card-text flex-grow-1">
            <strong>Report ID:</strong> ${report.id}<br>
            <strong>User:</strong> ${report.username} (ID: ${report.user_id})
          </p>
          <button class="btn btn-report mt-auto" onclick="closeReport(${report.id})">✅ Close Report</button>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

function closeReport(reportId) {
  fetch(`http://localhost:3000/api/reports/${reportId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ status: 1 })
  })
  .then(res => {
    if (!res.ok) throw new Error('Failed to close report');
    return res.json();
  })
  .then(data => {
    alert(`Report ${reportId} closed! Badges earned: ${data.badges_earned?.join(', ') || 'None'}`);
    fetchOpenReports();
  })
  .catch(err => {
    console.error(err);
    alert('Error closing report. Please try again.');
  });
}

