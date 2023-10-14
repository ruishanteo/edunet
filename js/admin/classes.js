const classesWorker = new Worker("/js/workers/classesWorker.js");

const reloadClasses = () => {
  args.updateType = "";
  args.studentId = args.user.studentId;
  classesWorker.postMessage(args);
};

const createClass = (params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  classesWorker.postMessage(args);
};

const deleteClass = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  classesWorker.postMessage(args);
};

const handleAddClass = () =>
  addModal(
    "Add Class",
    "add-class-form",
    `<div class="section">
        <h3 class="content-title">Name</h3> <input type="text" id="form-name" maxlength="20" required/><br />
        <h3 class="content-title">Day</h3> <input type="text" id="form-day" maxlength="15" required/> <br />
        <h3 class="content-title">Time</h3> <input type="text" id="form-time" maxlength="15" required/> <br /> 
        <h3 class="content-title">Venue</h3> <input type="text" id="form-venue" maxlength="20"/> 
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
    }
  );

addCallback(reloadClasses);
classesWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.classes) {
    renderClasses(
      e.data.classes,
      args,
      (id) => deleteClass({ classId: id }),
      handleAddClass
    );
  }
});
