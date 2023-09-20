class NoteCard extends HTMLElement {
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
        <div class="card node-card">
            <div class="subclass">
                <h4><b>Title Note</b></h4>
                <button class="icon-button">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
            
            <p>description notes</p>
        </div>
            `;

    // this.addEventListener("click", (event) => {
    //   event.stopPropagation();
    //   window.location.href = "/pages/admin/detailedTutors.html";
    // });
  }
}

customElements.define("note-card", NoteCard);
