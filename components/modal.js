class Modal {
  constructor(openTrigger, options) {
    this.config = Object.assign(
      {
        backgroundColor: "",
        modalTitle: "",
        modalText: null,
        onBefore: null,
        onAfter: null,
      },
      options
    );

    this.config.onBefore = this.config.onBefore.bind(this);
    this.config.onAfter = this.config.onAfter.bind(this);
    this.openTrigger = openTrigger;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.openTrigger.hasEventListener) {
      this.openTrigger.addEventListener("click", this.open.bind(this));
      this.openTrigger.hasEventListener = true;
    }
  }

  open() {
    this.render();
    this.modalDiv = document.getElementById("modal");
    this.myModalContent = document.querySelector(".modal-content");
    this.modalDiv.addEventListener("click", this.close.bind(this));

    if (this.config.onBefore) {
      this.config.onBefore();
    }

    this.modalDiv.classList.add("opened");
    this.myModalContent.classList.add("animate-in");

    setTimeout(() => {
      this.myModalContent.classList.remove("animate-in");
    }, 600);
  }

  close(e) {
    if (e.target.id === "close" && e.type === "click") {
      this.myModalContent.classList.add("animate-out");

      setTimeout(() => {
        this.myModalContent.classList.remove("animate-out");
        this.modalDiv.classList.remove("opened");
        this.containerDiv.parentNode.removeChild(this.containerDiv);
        if (this.config.onAfter) {
          this.config.onAfter();
        }
      }, 600);
    }

    return false;
  }

  render() {
    const html = this.htmlTemplate();

    this.containerDiv = document.createElement("div");

    this.containerDiv.innerHTML = html;

    if (this.config.scriptHandler) {
      const script = document.createElement("script");
      script.src = this.config.scriptHandler;
      this.containerDiv.appendChild(script);
    }
    document.body.appendChild(this.containerDiv);
  }

  htmlTemplate() {
    return `
    <link rel="stylesheet" href="/css/styles.css" />
    <link rel="stylesheet" href="/css/modal.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
			<div id="modal" class="modal">
				<div class="modal-content">
          <button id="close" class="icon-button fa fa-close"></button>
					<h1>${this.config.modalTitle}</h1>
          <form id=${this.config.formID}>
            <p>${this.config.modalText}</p>
          </form>
				</div>
			</div>
		`;
  }
}

const addClassModal = document.getElementById("add-class-button");
const addStudentModal = document.getElementById("add-student-button");
const addTutorModal = document.getElementById("add-tutor-button");
const addNoteModal = document.getElementById("add-note-button");
const addMessageModal = document.getElementById("add-message-button");

const openNoteModals = document.getElementsByClassName("node-card");

if (addClassModal) {
  new Modal(addClassModal, {
    modalTitle: "Add Class",
    modalText: `
      <div class="section">
        
        <button type="submit">Create</button>
      </div>`,
    scriptHandler: "/js/modals/addClass.js",
    formID: "add-class-form",
    onAfter: () => null,
    onBefore: () => null,
  });
}

if (addStudentModal) {
  new Modal(addStudentModal, {
    modalTitle: "Add Student",
    modalText: `
      <div class="section">
        <label>Name</label> <input type="name" required/><br />
        <label>Contact No.</label><input type="num" required/> <br />
        <label>Email</label><input type="email" required/> <br /> 
        <label>Parent's Contact No.</label><input type="p_num" required/> <br />
        <label>Parent's Email</label><input type="p_email" required/> <br /> 
        <label>Classes Enrolled</label> <input type="location" /> 
        <button type="submit">Create</button>
      </div>`,
    formID: "add-student-form",
    onAfter: () => null,
    onBefore: () => null,
  });
}

if (addTutorModal) {
  new Modal(addTutorModal, {
    modalTitle: "Add Tutor",
    modalText: `
      <div class="section">
        <label>Name</label> <input type="name" required/><br />
        <label>Contact No.</label><input type="num" required/> <br />
        <label>Email</label><input type="email" required/> <br /> 
        <button type="submit">Create</button>
      </div>`,
    formID: "add-tutor-form",
    onAfter: () => null,
    onBefore: () => null,
  });
}

if (addNoteModal) {
  new Modal(addNoteModal, {
    modalTitle: "Add Note",
    modalText: `
      <div class="section">
        <label>Title</label> <input type="title" required/><br />
        <label>Text</label><input type="text" required/> <br />
        <button type="submit">Create</button>
      </div>`,
    formID: "add-note-form",
    onAfter: () => null,
    onBefore: () => null,
  });
}

if (addMessageModal) {
  new Modal(addMessageModal, {
    modalTitle: "Send Message",
    modalText: `
      <div class="section">
        <label>To:</label> <input type="to" required/><br />
        <label>Text:</label> <textarea placeholder="Type message.." name="msg" required></textarea> <br />
        <button type="submit"><i class="fa fa-paper-plane"></i> Send</button>
      </div>`,
    formID: "add-message-form",
    onAfter: () => null,
    onBefore: () => null,
  });
}

if (openNoteModals && openNoteModals.length > 0) {
  Array.prototype.forEach.call(openNoteModals, function (openNoteModal) {
    new Modal(openNoteModal, {
      modalTitle: "Title",
      modalText: `
        <div class="section">
          <p> text description</p>
        </div>`,
      formID: "open-note-form",
      onAfter: () => null,
      onBefore: () => null,
    });
  });
}
