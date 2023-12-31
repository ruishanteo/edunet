function handleRouting(button) {
  const args = getArgs();
  const currLocation = window.location.href.toLowerCase();

  if (currLocation.includes("userauth")) {
    return backButton.remove();
  }
  if (
    currLocation.includes("detailedstudents") &&
    args.user.type === "student"
  ) {
    return button.remove();
  }
  if (currLocation.includes("detailedtutors") && args.user.type === "tutor") {
    return button.remove();
  }

  button.onclick = (e) => {
    e.preventDefault();
    if (
      currLocation.includes("detailedstudents") &&
      args.user.type === "tutor"
    ) {
      window.history.back();
      return;
    }

    if (currLocation.includes("detailedstudents")) {
      if (args.user.type === "parent") {
        window.location.href = args.homePageURL;
        return;
      }
      window.location.href = "/pages/mainPages/students.html";
      return;
    }

    if (currLocation.includes("detailedtutors")) {
      window.location.href = "/pages/admin/tutors.html";
      return;
    }

    if (currLocation.includes("detailedclasses")) {
      window.location.href = "/pages/mainPages/classes.html";
      return;
    }

    if (currLocation.includes("detailedmessage")) {
      window.location.href = "/pages/mainPages/messages.html";
      return;
    }
  };
}
class BackButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const args = getArgs();

    this.innerHTML = `
      <nav>
        <button id="back-button">
            <i class="fa fa-chevron-left"></i> 
            <span class="back-label">Back</span>
        </button>
      </nav>
        `;

    const backButton = window.document.getElementById("back-button");
    handleRouting(backButton);
  }
}

customElements.define("back-button", BackButton);
