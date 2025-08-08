document.addEventListener('DOMContentLoaded', () => {
  fetchUserLeaderboard();
});

function fetchUserLeaderboard() {
  fetch('http://localhost:3000/api/leaderboard/users')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('userLeaderboard');
      container.innerHTML = '';
      if (Array.isArray(data) && data.length > 0) {
        const list = document.createElement('ol');
        list.className = 'list-group list-group-numbered';
        data.forEach(user => {
          const item = document.createElement('li');
          item.className = 'list-group-item d-flex justify-content-between align-items-center';
          item.innerHTML = `
            <span>${user.username}</span>
            <span class="badge bg-success rounded-pill">${user.reputation}</span>
          `;
          list.appendChild(item);
        });
        container.appendChild(list);
      } else {
        container.textContent = 'No user leaderboard data available.';
      }
    })
    .catch(err => {
      document.getElementById('userLeaderboard').textContent = 'Error fetching user leaderboard.';
      console.error(err);
    });
}
