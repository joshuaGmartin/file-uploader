const path = window.location.pathname;

document.addEventListener("DOMContentLoaded", () => {
  // ============================================================================
  // /register or /login
  // ============================================================================

  if (path === "/login" || path === "/register") {
    // =======================================
    // show password
    // =======================================
    function showPassword() {
      const btn = document.getElementById("show-password-button");
      const passwordInputs = document.querySelectorAll(
        'input[type="password"]',
      );

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

  // ============================================================================
  // /drive
  // ============================================================================

  if (path.startsWith("/drive")) {
    // =======================================
    // create folder controls
    // =======================================
    function createFolderControls() {
      const createFolderButton = document.getElementById(
        "create-folder-button",
      );

      if (createFolderButton) {
        const createFolderModal = document.getElementById(
          "create-folder-modal",
        );

        createFolderButton.addEventListener("click", () => {
          createFolderModal.style.display = "block";
        });
      }
    }

    // =======================================
    // edit folder controls
    // =======================================
    function editFolderControls() {
      const editFolderBtns = document.querySelectorAll(".edit-folder-button");

      if (editFolderBtns) {
        const editFolderModal = document.getElementById("edit-folder-modal");
        const editFolderForm = document.getElementById("edit-folder-form");
        const editFolderInput =
          editFolderForm.querySelector("input#folderName");

        editFolderBtns.forEach((editBtn) => {
          editBtn.addEventListener("click", () => {
            editFolderModal.style.display = "block";

            editFolderForm.action = `/drive/${editBtn.dataset.folderId}/folder/edit`;
          });
        });
      }
    }

    createFolderControls();
    editFolderControls();
  }
});
