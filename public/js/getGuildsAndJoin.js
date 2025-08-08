const userId = Number(localStorage.getItem("userId"));
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
  fetchAllGuilds();
});

// Fetch and render all guilds
function fetchAllGuilds() {
  fetch("http://localhost:3000/api/guilds")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch guilds");
      return res.json();
    })
    .then((data) => {
      const list = document.getElementById("guildList");
      list.innerHTML = "";

      if (Array.isArray(data) && data.length > 0) {
        data.forEach((guild) => {
          const card = document.createElement("div");
          card.className = "card col-md-4 shadow-sm guild-card m-2";

          let memberIds = [];
          if (Array.isArray(guild.member_ids)) {
            memberIds = guild.member_ids.map((id) => Number(id));
          } else if (typeof guild.member_ids === "string") {
            memberIds = guild.member_ids
              .split(",")
              .map((id) => Number(id.trim()));
          }

          const userIsMember = memberIds.includes(userId);
          const actionButton = userIsMember
            ? `<button class="btn btn-warning me-2 " onclick="quitGuild()">Quit Guild</button>`
            : `<button class="btn btn-primary me-2" onclick="joinGuild(${guild.id})">Join Guild</button>`;

          // Admin-only delete button
          const deleteButton =
            userId === 1
              ? `<button class="btn btn-danger" onclick="deleteGuild(${guild.id})">Delete</button>`
              : "";

          card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">${guild.name}</h5>
              <p class="card-text">
                ${guild.description || "No description"}<br>
                Members: ${guild.member_count || 0}
              </p>
              ${actionButton}
              ${deleteButton}
              ${
                userId === 1
                  ? `
                <div class="dropdown mt-3">
                  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Manage Members
                  </button>
                  <ul class="dropdown-menu" id="member-dropdown-${guild.id}">
                    <li><span class="dropdown-item-text text-muted">Loading members...</span></li>
                  </ul>
                </div>
              `
                  : ""
              }
            </div>
          `;

          list.appendChild(card);

          // If admin, fetch and populate member dropdown
          if (userId === 1) {
            fetch(`http://localhost:3000/api/guilds/${guild.id}/members`)
              .then((res) => {
                if (!res.ok) throw new Error("Failed to load members");
                return res.json();
              })
              .then((users) => {
                const dropdown = document.getElementById(`member-dropdown-${guild.id}`);
                dropdown.innerHTML = "";

                if (users.length === 0) {
                  dropdown.innerHTML = `<li><span class="dropdown-item-text text-muted">No members</span></li>`;
                }

                users.forEach((user) => {
                  if (user.id === 1) return; // Skip admin

                  const li = document.createElement("li");
                  li.innerHTML = `
                    <span class="dropdown-item d-flex justify-content-between align-items-center">
                      ${user.username}
                      <button style="margin-left: 20px;" class="btn btn-sm btn-danger remove-member-btn" data-user-id="${user.id}">
                        Remove
                      </button>
                    </span>
                  `;
                  dropdown.appendChild(li);
                });
              })
              .catch((err) => {
                console.error("Error fetching members:", err);
                const dropdown = document.getElementById(`member-dropdown-${guild.id}`);
                dropdown.innerHTML = `<li><span class="dropdown-item-text text-danger">Error loading members</span></li>`;
              });
          }
        });
      } else {
        list.textContent = "No guilds found.";
      }
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("guildList").textContent = `Error loading guilds: ${err.message}`;
    });
}

// Join a guild
function joinGuild(guildId) {
  fetch(`http://localhost:3000/api/guilds/${guildId}/join`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ user_id: userId }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to join guild");
      return res.json();
    })
    .then((response) => {
      fetchAllGuilds();
      let message = "Successfully joined the guild!";
      if (response.badges_earned?.length > 0) {
        message += `\n Badges earned: ${response.badges_earned.join("\n- ")}`;
      }
      alert(message);
    })
    .catch((err) => {
      console.error(err);
      alert("You are already in a guild or could not join.");
    });
}

// Quit guild
function quitGuild() {
  fetch(`http://localhost:3000/api/guilds/members/${userId}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to quit guild");
      return res.json();
    })
    .then(() => {
      alert("You have left your guild.");
      fetchAllGuilds();
    })
    .catch((err) => {
      console.error(err);
      alert("Error leaving guild.");
    });
}

// Delete Guild (admin only)
function deleteGuild(guildId) {
  if (!confirm("Are you sure you want to delete this guild?")) return;

  fetch(`http://localhost:3000/api/guilds/${guildId}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to delete guild");
      return res.json();
    })
    .then((data) => {
      alert(data.message || "Guild deleted.");
      fetchAllGuilds();
    })
    .catch((err) => {
      console.error(err);
      alert("Error deleting guild: " + err.message);
    });
}

// Handle "Remove" button click (admin only)
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("remove-member-btn")) {
    const userIdToRemove = e.target.dataset.userId;

    if (confirm("Remove this user from their guild?")) {
      fetch(`http://localhost:3000/api/guilds/members/${userIdToRemove}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to remove member");
          return res.json();
        })
        .then(() => {
          alert("User removed from guild.");
          fetchAllGuilds();
        })
        .catch(err => {
          console.error(err);
          alert("Error removing user.");
        });
    }
  }
});
