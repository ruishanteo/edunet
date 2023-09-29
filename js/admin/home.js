const classesWorker = new Worker("/js/workers/classesWorker.js");
const studentsWorker = new Worker("/js/workers/studentsWorker.js");

const reloadClasses = () => {
  const args = getArgs();
  args.updateType = "";
  classesWorker.postMessage(args);
};

const reloadStudents = () => {
  const args = getArgs();
  args.updateType = "";
  studentsWorker.postMessage(args);
};

const deleteClass = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  classesWorker.postMessage(args);
};

classesWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.classes) {
    renderClasses(
      e.data.classes,
      args,
      (id) => deleteClass({ classId: id }),
      () => null
    );
  }
});

studentsWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.students) {
    renderStudents(
      e.data.students,
      args,
      () => {},
      () => null
    );
  }
});

addCallback(() => {
  const user = getArgs().user;
  const adminName = document.getElementById("admin-name");
  adminName.textContent = user.fullName;
  reloadClasses();
  reloadStudents();
});
