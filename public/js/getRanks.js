document.addEventListener("DOMContentLoaded", () => {
  const ranks = [
    { name: "Novice", xp: 0, image: "https://img.icons8.com/fluency/96/000000/baby.png" },
    { name: "Tracker", xp: 100, image: "https://img.icons8.com/color/96/trekking.png" },
    { name: "Elite Hunter", xp: 250, image: "/images/elitehunter.png" },
    { name: "Master Hunter", xp: 500, image: "/images/masterhunter.png" },
  ];

  const rankList = document.getElementById("rankList");

  ranks.forEach(rank => {
    const col = document.createElement("div");
    col.className = "col-md-3";

    col.innerHTML = `
      <div class="card rank-card h-100">
        <div class="card-body d-flex flex-column align-items-center">
          <img src="${rank.image}" alt="${rank.name}" class="mb-3"/>
          <h5 class="card-title">${rank.name}</h5>
          <p class="card-text">${rank.xp}+ XP required</p>
        </div>
      </div>
    `;

    rankList.appendChild(col);
  });
});
