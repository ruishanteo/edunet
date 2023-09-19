class ClassCard extends HTMLElement {
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
        <h4><b>P5_Math</b></h4>
        <button class="icon-button">
            <i class="fa fa-trash"></i>
        </button>
      </div>
      
      <p>Sunday 9am - 10.30am</p>
      <p>Room 2</p>
      <p>23 students enrolled</p>
    </div>
        `;

    this.addEventListener("click", (event) => {
      event.stopPropagation();
      window.location.href = "/pages/admin/detailedClasses.html";
    });
  }
}

customElements.define("class-card", ClassCard);
