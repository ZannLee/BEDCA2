document.addEventListener("DOMContentLoaded", () => {
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    console.warn("User not logged in. Cannot fetch badges.");
    return;
  }

  fetchBadgesForUser(userId);
});

function fetchBadgesForUser(userId) {
  const url = `http://localhost:3000/api/badges/${userId}`;

  fetch(url, {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
    .then(response => {
      if (!response.ok) throw new Error(`Failed to fetch badges. Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      const badgeList = document.getElementById("userExtras");
      if (!badgeList) {
        console.warn("Badge container element #userExtras not found.");
        return;
      }

      badgeList.innerHTML = "";

      if (Array.isArray(data) && data.length > 0) {
        data.forEach(badge => {
          const span = document.createElement("span");
          span.className = "badge";
          span.title = badge.description || "No description available";
          span.textContent = badge.name;
          badgeList.appendChild(span);
        });
      } else {
        badgeList.innerHTML = `<p class="text-center text-muted fw-semibold">No badges found for this user.</p>`;
      }
    })
    .catch(err => {
      console.error("Error fetching badges:", err);
      const badgeList = document.getElementById("userExtras");
      if (badgeList) badgeList.textContent = `Error fetching badges: ${err.message}`;
    });
}
