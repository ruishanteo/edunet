const tutorsWorker = new Worker("/js/workers/tutorsWorker.js");

const reloadTutors = () => {
  const args = getArgs();
  args.updateType = "";
  tutorsWorker.postMessage(args);
};

const createTutor = (params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  tutorsWorker.postMessage(args);
};

const deleteTutor = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  tutorsWorker.postMessage(args);
};

addCallback(reloadTutors);
tutorsWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.tutors) {
    renderTutors(e.data.tutors, args, (id) => deleteTutor({ tutorId: id }));
  }
});

const addTutorButton = document.getElementById("add-tutor-button");
addTutorButton.addEventListener("click", (event) => {
  event.preventDefault();
  addModal(
    "Add Tutor",
    "add-tutor-form",
    `<div class="section">
          <h3 class="content-title">Full Name</h3> <input type="text" id="form-name" required/><br />
          <h3 class="content-title">Contact No.</h3> <input type="text" id="form-contact" required/> <br />
          <h3 class="content-title">Email</h3> <input type="email" id="form-email" required/> <br /> 
          <button type="submit">Create</button>
      </div>`,
    null,
    (close) => {
      const fullName = document.getElementById("form-name").value;
      const contact = document.getElementById("form-contact").value;
      const email = document.getElementById("form-email").value;

      createTutor({ fullName, contact, email });
      close();
    }
  );
});
