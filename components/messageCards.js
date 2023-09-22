class MessageCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <link rel="stylesheet" href="/css/styles.css" />
        <link rel="stylesheet" href="/css/messageCard.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <div class="card">
          <div class="subclass">
            <div class="message-body">
              <h4><b>THIS IS THE TITLE OF THE MESSAGE</b></h4>
              <p>Fugiat Lorem officia et cupidatat anim ullamco do et mollit qui. Ad incididunt excepteur id tempor non elit. Magna cupidatat veniam officia aliquip nostrud. In occaecat ad anim proident ipsum sunt laboris aliquip aliquip. Velit culpa sit minim amet amet.</p>
            </div>
            <button class="icon-button">
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
            `;

    this.addEventListener("click", (event) => {
      event.stopPropagation();
      window.location.href = "/pages/mainPages/detailedMessage.html";
    });
  }
}

customElements.define("message-card", MessageCard);
