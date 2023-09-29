class BackButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <nav>
        <button id="back-button">
            <i class="fa fa-chevron-left"></i> Back
        </button>
      </nav>
        `;

    const backButton = window.document.getElementById("back-button");
    if (
      document.referrer === document.location.href ||
      document.referrer.toLowerCase().includes("userauth")
    ) {
      backButton.remove();
    } else {
      backButton.onclick = (e) => {
        e.preventDefault();
        window.location.replace(document.referrer);
      };
    }
  }
}

customElements.define("back-button", BackButton);
