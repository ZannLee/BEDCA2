document.addEventListener('DOMContentLoaded', () => {
  fetchAllBadges();
});

function fetchAllBadges() {
  fetch('http://localhost:3000/api/badges')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch badges');
      return res.json();
    })
    .then((badges) => {
      const badgeList = document.getElementById('badgeList');
      badgeList.innerHTML = '';

      if (Array.isArray(badges) && badges.length > 0) {
        const row = document.createElement('div');
        row.className = 'row g-4';

        badges.forEach((badge) => {
          const col = document.createElement('div');
          col.className = 'col-sm-6 col-md-4 col-lg-3';

        const imageFileName = badge.name.toLowerCase().replace(/\s+/g, '_') + '.png';

        col.innerHTML = `
        <div class="card badge-card h-100 text-center">
          <div class="card-body">
            <img src="/images/${imageFileName}" alt="${badge.name}" class="img-fluid badge-img" />
            <h5 class="card-title">${badge.name}</h5>
            <p class="card-text">${badge.description || ''}</p>
          </div>
        </div>
        `;

          row.appendChild(col);
        });

        badgeList.appendChild(row);
      } else {
        badgeList.textContent = 'No badges found.';
      }
    })
    .catch((err) => {
      console.error(err);
      const badgeList = document.getElementById('badgeList');
      badgeList.textContent = `Error loading badges: ${err.message}`;
    });
}
