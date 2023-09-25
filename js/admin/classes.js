const classesWorker = new Worker("/js/workers/classesWorker.js");

const reloadClasses = () => {
  args.updateType = "";
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
        <label>Name</label> <input type="text" id="form-name" maxlength="20" required/><br />
        <label>Day</label><input type="text" id="form-day" maxlength="10" required/> <br />
        <label>Time</label><input type="text" id="form-time" maxlength="10" required/> <br /> 
        <label>Venue</label> <input type="text" id="form-venue" maxlength="20"/> 
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
