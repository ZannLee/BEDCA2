document.addEventListener('DOMContentLoaded', () => {
  const userId = Number(localStorage.getItem("userId"));
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    console.error("User not authenticated (missing userId or token).");
    return;
  }

  fetch(`http://localhost:3000/api/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch user data.");
      return res.json();
    })
    .then(user => {
      const reputation = user.reputation ?? 0;
      const repElem = document.getElementById("userReputation");
      if (repElem) {
        repElem.textContent = `Reputation: ${reputation} pts`;
      }
    })
    .catch(err => {
      console.error("Error loading reputation:", err);
    });
});