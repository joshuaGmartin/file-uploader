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

    // =======================================
    // focus on first input
    // =======================================
    function focusSelectInput() {
      const firstError = document.querySelector(".error-list-item"); // only need first to focus/select on

      // if error, get data-error-type (lines up with input name)
      if (firstError) {
        const focusInput = document.querySelector(
          `input[name="${firstError.dataset.errorType}"]`,
        );

        focusInput.focus();
        focusInput.select();
      } else {
        const focusInput = document.querySelector("input"); // else focus on first input
        focusInput.focus();
      }
    }

    showPassword();
    fillDemoPassword();
    focusSelectInput();
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
          createFolderModal.classList.toggle("hidden");

          createFolderModal.querySelector("input#folderName").focus();
        });
      }
    }

    // =======================================
    // edit folder controls
    // =======================================
    function editFolderControls() {
      const editFolderBtns = document.querySelectorAll(".edit-folder-button");

      if (editFolderBtns.length > 0) {
        const editFolderModal = document.getElementById("edit-folder-modal");
        const editFolderForm = document.getElementById("edit-folder-form");
        const editFolderInput =
          editFolderForm.querySelector("input#folderName");

        editFolderBtns.forEach((editBtn) => {
          editBtn.addEventListener("click", (e) => {
            e.preventDefault();

            editFolderModal.classList.toggle("hidden");

            editFolderForm.action = `/drive/folder/${editBtn.dataset.folderId}/edit`;
            editFolderInput.value = editBtn.dataset.folderName;

            editFolderInput.focus();
            editFolderInput.select();
          });
        });
      }
    }

    // =======================================
    // share folder controls
    // =======================================
    function shareFolderControls() {
      const shareFolderBtn = document.querySelector(".share-folder-button");

      if (shareFolderBtn) {
        const shareFolderModal = document.getElementById("share-folder-modal");
        const shareFolderForm = document.getElementById("share-folder-form");

        const shareFolderInput =
          shareFolderForm.querySelector("input#shareTime");

        shareFolderBtn.addEventListener("click", () => {
          shareFolderModal.style.display = "block";
          shareFolderModal.classList.toggle("hidden");

          shareFolderInput.focus();
          shareFolderInput.select();
        });
      }
    }

    // =======================================
    // add file controls
    // =======================================
    function addFileControls() {
      const addFilesButton = document.getElementById("add-files-button");

      if (addFilesButton) {
        const addFilesModal = document.getElementById("add-files-modal");

        addFilesButton.addEventListener("click", () => {
          addFilesModal.classList.toggle("hidden");
        });
      }
    }

    // =======================================
    // edit file controls
    // =======================================
    function editFileControls() {
      const editFileBtns = document.querySelectorAll(".edit-file-button");

      if (editFileBtns.length > 0) {
        const editFileModal = document.getElementById("edit-file-modal");
        const editFileForm = document.getElementById("edit-file-form");
        const editFileInput = editFileForm.querySelector("input#fileName");

        editFileBtns.forEach((editBtn) => {
          editBtn.addEventListener("click", () => {
            editFileModal.classList.toggle("hidden");

            editFileForm.action = `/drive/file/${editBtn.dataset.fileId}/edit`;
            editFileInput.value = editBtn.dataset.fileName;

            editFileInput.focus();
            editFileInput.select();
          });
        });
      }
    }

    // =======================================
    // auto close modal
    // =======================================
    function modalExit() {
      const modalOverlays = document.querySelectorAll(".modal-overlay");

      if (modalOverlays) {
        modalOverlays.forEach((overlay) => {
          overlay.addEventListener("click", (e) => {
            // allow click on modal
            if (e.target === overlay) {
              // need reload to reset modal data (ex: error data can carry over to another modal if no reset)
              window.location.reload();
            }
          });
        });
      }

      const modalCloseBtns = document.querySelectorAll(".modal-close");

      if (modalCloseBtns) {
        modalCloseBtns.forEach((closeBtn) => {
          closeBtn.addEventListener("click", () => {
            // need reload to reset modal data (ex: error data can carry over to another modal if no reset)
            window.location.reload();
          });
        });
      }

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;

        const modals = document.querySelectorAll(".modal-overlay"); // overlay has the hidden class

        // look for non-hidden (open) modal
        const hasOpenModal = document.querySelector(
          ".modal-overlay:not(.hidden)",
        );

        if (hasOpenModal) {
          // let JS stack finish, then reload
          setTimeout(() => {
            window.location.reload();
          }, 0);
        }
      });
    }

    createFolderControls();
    editFolderControls();
    shareFolderControls();
    addFileControls();
    editFileControls();
    modalExit();
  }
});
