const urlParams = new URLSearchParams(window.location.search);
const parentId = parseInt(urlParams.get("parentId"));

const studentsWorker = new Worker("/js/workers/studentsWorker.js");

const reloadStudents = () => {
  const args = getArgs();
  args.updateType = "";
  args.parentId = parentId;
  studentsWorker.postMessage(args);
};

{
  studentsWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.students) {
      renderParent(getArgs());
      renderStudents(
        e.data.students,
        args,
        null,
        null,
        "/pages/mainPages/studentHome.html"
      );
    }
  });
}

addCallback((args) => {
  reloadStudents();
});
