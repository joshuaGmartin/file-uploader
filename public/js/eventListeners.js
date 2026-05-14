const path = window.location.pathname;

// ============================================================================
// /register or /login
// ============================================================================

if (path === "/login" || path === "/register") {
  // =======================================
  // show password
  // =======================================
  function showPassword() {
    const btn = document.getElementById("show-password-button");
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    if (btn && passwordInputs) {
      btn.addEventListener("click", () => {
        passwordInputs.forEach((passwordInput) => {
          if (passwordInput.type === "password") {
            passwordInput.type = "text";
          } else {
            passwordInput.type = "password";
          }
        });
      });
    }
  }

  // =======================================
  // fill demo password
  // =======================================
  function fillDemoPassword() {
    const btn = document.getElementById("demo-password-button");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    if (btn) {
      btn.addEventListener("click", (e) => {
        // no submit
        e.preventDefault();

        const demoPassword = "!@#123QWEqwe";
        passwordInput.value = demoPassword;
        passwordInput.textContent = demoPassword;
        if (confirmPasswordInput) {
          confirmPasswordInput.value = demoPassword;
          confirmPasswordInput.textContent = demoPassword;
        }
      });
    }
  }

  showPassword();
  fillDemoPassword();
}
