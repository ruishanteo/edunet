const classesWorker = new Worker("/js/workers/classesWorker.js");
const studentsWorker = new Worker("/js/workers/studentsWorker.js");
const messagesWorker = new Worker("/js/workers/messagesWorker.js");

const classesCard = document.getElementById("classes-card");
const studentsCard = document.getElementById("students-card");
const profileCard = document.getElementById("profile-card");
const messagesCard = document.getElementById("messages-card");

classesCard.onclick = () => {
  window.location.href = "/pages/mainPages/classes.html";
};

studentsCard.onclick = () => {
  window.location.href = "/pages/mainPages/students.html";
};

profileCard.onclick = () => {
  window.location.href = `/pages/mainPages/detailedTutors.html?tutorId=${
    getArgs().user.tutorId
  }`;
};

messagesCard.onclick = () => {
  window.location.href = "/pages/mainPages/messages.html";
};

const reloadClasses = () => {
  const args = getArgs();
  args.updateType = "";
  args.tutorId = args.user.tutorId;
  classesWorker.postMessage(args);
};

const reloadStudents = () => {
  const args = getArgs();
  args.updateType = "";
  args.tutorId = args.user.tutorId;
  studentsWorker.postMessage(args);
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

messagesWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.chats) {
    const messagesCount = document.getElementById("messages-count");
    messagesCount.textContent = `(${e.data.chats.length})  chats`;
  }
});

addCallback(() => {
  const user = getArgs().user;
  const tutorNme = document.getElementById("tutor-name");
  tutorNme.textContent = user.fullName;
  reloadClasses();
  reloadStudents();
  reloadChats();
});
