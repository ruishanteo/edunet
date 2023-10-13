const classesWorker = new Worker("/js/workers/classesWorker.js");
const studentsWorker = new Worker("/js/workers/studentsWorker.js");
const tutorsWorkers = new Worker("/js/workers/tutorsWorker.js");
const messagesWorker = new Worker("/js/workers/messagesWorker.js");

const classesCard = document.getElementById("classes-card");
const studentsCard = document.getElementById("students-card");
const tutorsCard = document.getElementById("tutors-card");
const messagesCard = document.getElementById("messages-card");

classesCard.onclick = () => {
  window.location.href = "/pages/admin/classes.html";
};

studentsCard.onclick = () => {
  window.location.href = "/pages/admin/students.html";
};

tutorsCard.onclick = () => {
  window.location.href = "/pages/admin/tutors.html";
};

messagesCard.onclick = () => {
  window.location.href = "/pages/mainPages/messages.html";
};

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

const reloadTutors = () => {
  const args = getArgs();
  args.updateType = "";
  tutorsWorkers.postMessage(args);
};

const reloadChats = () => {
  const args = getArgs();
  args.updateType = "get";
  messagesWorker.postMessage(args);
};

classesWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.classes) {
    const classesCount = document.getElementById("classes-count");
    classesCount.textContent = `(${e.data.classes.length})  classes`;
  }
});

studentsWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.students) {
    const studentsCount = document.getElementById("students-count");
    studentsCount.textContent = `(${e.data.students.length})  students`;
  }
});

tutorsWorkers.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.tutors) {
    const tutorsCount = document.getElementById("tutors-count");
    tutorsCount.textContent = `(${e.data.tutors.length})  tutors`;
  }
});

messagesWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.chats) {
    const messagesCount = document.getElementById("messages-count");
    messagesCount.textContent = `(${e.data.chats.length})  chats`;
  }
});

addCallback(() => {
  const user = getArgs().user;
  const adminName = document.getElementById("admin-name");
  adminName.textContent = user.fullName;
  reloadClasses();
  reloadStudents();
  reloadTutors();
  reloadChats();
});
