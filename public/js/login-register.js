document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const showRegisterBtn = document.getElementById("showRegisterBtn");
  const showLoginBtn = document.getElementById("showLoginBtn");
  const showForgotBtn = document.getElementById("showForgotBtn");
  const showLoginFromResetBtn = document.getElementById("showLoginFromResetBtn");

  const loginWarning = document.getElementById("loginWarning");
  const registerWarning = document.getElementById("registerWarning");
  const resetWarning = document.getElementById("resetWarning");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const resetForm = document.getElementById("resetPasswordForm");

  // Cards
  const loginCard = document.querySelector(".card-flip > .front");
  const registerCard = document.querySelector(".card-flip > .back");
  const resetCard = document.querySelector(".card-flip > .reset");

  // Show one card, hide others
  function showCard(cardToShow) {
    [loginCard, registerCard, resetCard].forEach(card => {
      card.classList.remove("show");
    });
    cardToShow.classList.add("show");
  }

  // Alert helpers
  function showAlert(element, message) {
    element.innerText = message;
    element.classList.remove("d-none");
  }

  function hideAlert(element) {
    element.classList.add("d-none");
    element.innerText = "";
  }

  // JWT parser helper
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Initial UI state
  showCard(loginCard);
  hideAlert(loginWarning);
  hideAlert(registerWarning);
  hideAlert(resetWarning);

  // Navigation buttons
  showRegisterBtn.addEventListener("click", () => {
    showCard(registerCard);
    hideAlert(loginWarning);
    hideAlert(registerWarning);
    hideAlert(resetWarning);
  });

  showLoginBtn.addEventListener("click", () => {
    showCard(loginCard);
    hideAlert(loginWarning);
    hideAlert(registerWarning);
    hideAlert(resetWarning);
  });

  showForgotBtn.addEventListener("click", () => {
    showCard(resetCard);
    hideAlert(loginWarning);
    hideAlert(registerWarning);
    hideAlert(resetWarning);
  });

  showLoginFromResetBtn.addEventListener("click", () => {
    showCard(loginCard);
    hideAlert(loginWarning);
    hideAlert(registerWarning);
    hideAlert(resetWarning);
  });

  // Login form submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAlert(loginWarning);

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!username || !password) {
      showAlert(loginWarning, "Please enter both username and password.");
      return;
    }

    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200 && data.token) {
          localStorage.setItem("token", data.token);
          const payload = parseJwt(data.token);
          if (payload && payload.userId) {
            localStorage.setItem("userId", payload.userId);

            if (payload.userId === 1) {
              window.location.href = "admin.html";
            } else {
              window.location.href = "home.html";
            }
          }
        } else {
          showAlert(loginWarning, data.message || "Login failed.");
        }
      })
      .catch(() => {
        showAlert(loginWarning, "An error occurred during login.");
      });
  });

  // Register form submission
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAlert(registerWarning);

    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;

    if (!username || !email || !password || !confirmPassword) {
      showAlert(registerWarning, "Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      showAlert(registerWarning, "Passwords do not match.");
      return;
    }

    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
      .then(res => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200 && data.token) {
          localStorage.setItem("token", data.token);
          const payload = parseJwt(data.token);
          if (payload && payload.userId) {
            localStorage.setItem("userId", payload.userId);
          }
          window.location.href = "home.html";
        } else if (status === 409) {
          showAlert(registerWarning, "Username or email already exists.");
        } else {
          showAlert(registerWarning, data.message || "Registration failed.");
        }
      })
      .catch(() => {
        showAlert(registerWarning, "An error occurred during registration.");
      });
  });

  // Reset Password form submission
  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAlert(resetWarning);

    const username = document.getElementById("resetUsername").value.trim();
    const email = document.getElementById("resetEmail").value.trim();
    const newPassword = document.getElementById("resetNewPassword").value;

    if (!username || !email || !newPassword) {
      showAlert(resetWarning, "Please fill in all fields.");
      return;
    }

    fetch("/api/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, newPassword }),
    })
      .then(res => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200) {
          showAlert(resetWarning, "Password reset successful! Please login.");
          resetForm.reset();
        } else {
          showAlert(resetWarning, data.message || "Password reset failed.");
        }
      })
      .catch(() => {
        showAlert(resetWarning, "Network or server error during password reset.");
      });
  });
});
