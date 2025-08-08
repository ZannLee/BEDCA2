const userId = Number(localStorage.getItem("userId"));
const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', () => {
  if (!userId || !token) {
    console.error("User ID or token not found in localStorage.");
    return;
  }

  fetch(`/api/reports/stats/${userId}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch bug stats");
      return res.json();
    })
    .then((data) => {
      document.getElementById("bugsReported").textContent = data.bugsReported ?? 0;
      document.getElementById("bugsClosed").textContent = data.bugsClosed ?? 0;
    })
    .catch((err) => {
      console.error("Error loading bug stats:", err);
    });
});

