document.addEventListener("DOMContentLoaded", () => {
  const userId = parseInt(localStorage.getItem("userId"), 10);

  // Show admin tab in navbar if user is admin
  const adminNavItem = document.getElementById("adminNavItem");
  if (adminNavItem && userId === 1) {
    adminNavItem.classList.remove("d-none");
  }

  // If this page is admin-only, enforce access
  const isAdminPage = document.body.classList.contains("admin-page");

  if (isAdminPage && userId !== 1) {
    alert("Access denied. Admins only.");
    window.location.href = "home.html";
  }
});
