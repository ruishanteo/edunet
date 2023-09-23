const tutorsWorker = new Worker("/js/workers/tutorsWorker.js");

const reloadTutors = () => {
  args.updateType = "";
  tutorsWorker.postMessage(args);
};

const createTutor = (params) => {
  args.updateType = "create";
  args.updateBody = params;
  tutorsWorker.postMessage(args);
};

const deleteTutor = (params) => {
  args.updateType = "delete";
  args.updateBody = params;
  tutorsWorker.postMessage(args);
};

addCallback(reloadTutors);
tutorsWorker.addEventListener("message", function (e) {
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
          <label>Full Name</label> <input type="text" id="form-name" required/><br />
          <label>Contact No.</label><input type="text" id="form-contact" required/> <br />
          <label>Email</label><input type="email" id="form-email" required/> <br /> 
          <button type="submit">Create</button>
      </div>`,
    null,
    (close) => {
      const fullName = document.getElementById("form-name").value;
      const contact = document.getElementById("form-contact").value;
      const email = document.getElementById("form-email").value;

      createTutor({ fullName, contact, email });
      close();
    },
    null
  );
});
