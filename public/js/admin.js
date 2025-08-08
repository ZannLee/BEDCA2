document.addEventListener('DOMContentLoaded', () => {
  const vulnForm = document.getElementById('vulnForm');
  const editUserForm = document.getElementById('editUserForm');

  const token = localStorage.getItem('token');
  const userId = Number(localStorage.getItem('userId'));

  if (!token || !userId) {
    console.warn("User not authenticated. Token or userId missing.");
    return;
  }

  // === Vulnerability Form Submission ===
  if (vulnForm) {
    vulnForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = document.getElementById('vulnType').value.trim();
      const description = document.getElementById('vulnDesc').value.trim();
      const points = parseInt(document.getElementById('vulnPoints').value, 10);

      if (!type || !description || isNaN(points)) {
        alert("Please fill out all fields correctly.");
        return;
      }

      fetch('http://localhost:3000/api/vulnerabilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ type, description, points })
      })
        .then((res) => {
          if (!res.ok) return res.text().then(msg => { throw new Error(msg); });
          return res.json();
        })
        .then(() => {
          alert("Vulnerability created successfully.");
          vulnForm.reset();
        })
        .catch((err) => {
          console.error("Error creating vulnerability:", err);
          alert("Failed to create vulnerability:\n" + err.message);
        });
    });
  }

  // === User Update Form Submission ===
  if (editUserForm) {
    editUserForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = parseInt(document.getElementById('userId').value, 10);
      const username = document.getElementById('username').value.trim();
      const reputation = parseInt(document.getElementById('reputation').value, 10);

      if (!username || isNaN(id) || isNaN(reputation)) {
        alert("Please fill out all fields correctly.");
        return;
      }

      fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ id, username, reputation })
      })
        .then((res) => {
          if (!res.ok) return res.text().then(msg => { throw new Error(msg); });
          return res.json();
        })
        .then(() => {
          alert("User updated successfully.");
          editUserForm.reset();
        })
        .catch((err) => {
          console.error("Error updating user:", err);
          alert("Failed to update user:\n" + err.message);
        });
    });
  }
});
