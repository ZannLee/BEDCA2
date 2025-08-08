document.addEventListener('DOMContentLoaded', () => {
  fetchGuildLeaderboard();
});

function fetchGuildLeaderboard() {
  fetch('http://localhost:3000/api/leaderboard/guilds')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('guildLeaderboard');
      container.innerHTML = '';
      if (Array.isArray(data) && data.length > 0) {
        const list = document.createElement('ol');
        list.className = 'list-group list-group-numbered';
        data.forEach(guild => {
          const item = document.createElement('li');
          item.className = 'list-group-item d-flex justify-content-between align-items-center';
          item.innerHTML = `
            <span>${guild.name}</span>
            <span class="badge bg-info rounded-pill">${guild.reputation}</span>
          `;
          list.appendChild(item);
        });
        container.appendChild(list);
      } else {
        container.textContent = 'No guild leaderboard data available.';
      }
    })
    .catch(err => {
      document.getElementById('guildLeaderboard').textContent = 'Error fetching guild leaderboard.';
      console.error(err);
    });
}
