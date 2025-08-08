document.addEventListener("DOMContentLoaded", () => {
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    console.warn("User not logged in. Cannot fetch rank.");
    return;
  }

  fetchRankForUser(userId, token);
});

function fetchRankForUser(userId, token) {
  const url = `http://localhost:3000/api/users/${userId}/rank`;

  fetch(url, {
    headers: {
      "Authorization": "Bearer " + token,
    },
  })
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch rank.");
      return response.json();
    })
    .then(data => {
      const rankText = document.getElementById("userRankName");
      if (rankText && data?.rank) {
        rankText.textContent = data.rank;
      } else {
        console.warn("Rank data or element missing.");
      }
    })
    .catch(err => {
      console.error("Error fetching rank:", err);
    });
}


