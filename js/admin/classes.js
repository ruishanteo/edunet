const classesWorker = new Worker("/js/workers/classesWorker.js");

const reloadClasses = () => {
  args.updateType = "";
  classesWorker.postMessage(args);
};

const createClass = (params) => {
  args.updateType = "create";
  args.updateBody = params;
  classesWorker.postMessage(args);
};

const deleteClass = (params) => {
  args.updateType = "delete";
  args.updateBody = params;
  classesWorker.postMessage(args);
};

addCallback(reloadClasses);
classesWorker.addEventListener("message", function (e) {
  if (e.data.classes) {
    renderClasses(e.data.classes, args, (id) => deleteClass({ classId: id }));
  }
});

const addClassButton = document.getElementById("add-class-button");
addClassButton.addEventListener("click", (event) => {
  event.preventDefault();
  addModal(
    "Add Class",
    "add-class-form",
    `<div class="section">
          <label>Name</label> <input type="text" id="form-name" required/><br />
          <label>Day</label><input type="text" id="form-day" required/> <br />
          <label>Time</label><input type="text" id="form-time" required/> <br /> 
          <label>Venue</label> <input type="text" id="form-venue"/> 
          <button type="submit">Create</button>
      </div>`,
    null,
    (close) => {
      const name = document.getElementById("form-name").value;
      const day = document.getElementById("form-day").value;
      const time = document.getElementById("form-time").value;
      const venue = document.getElementById("form-venue").value;

      createClass({ name, day, time, venue });
      close();
    },
    null
  );
});
