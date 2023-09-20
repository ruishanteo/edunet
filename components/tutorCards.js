class TutorCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="/css/styles.css" />
      <link rel="stylesheet" href="/css/card.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <div class="card">
        <div class="subclass">
          <h4><b>PhD Teacher Booboo</b></h4>
          <button class="icon-button">
            <i class="fa fa-trash"></i>
          </button>
        </div>
          
        <p>P5_Science</p>
        <p>P5_Math</p>
        <p>P5_English</p>
      </div>
          `;

    this.addEventListener("click", (event) => {
      event.stopPropagation();
      window.location.href = "/pages/admin/detailedTutors.html";
    });
  }
}

customElements.define("tutor-card", TutorCard);
