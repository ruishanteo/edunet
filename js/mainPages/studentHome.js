const urlParams = new URLSearchParams(window.location.search);
let studentId = parseInt(urlParams.get("studentId"));

const announcementsWorker = new Worker("/js/workers/announcementsWorker.js");
const homeworkWorker = new Worker("/js/workers/homeworkWorker.js");
const classesWorker = new Worker("/js/workers/classesWorker.js");
const messagesWorker = new Worker("/js/workers/messagesWorker.js");

const classesCard = document.getElementById("classes-card");
const profileCard = document.getElementById("profile-card");
const messagesCard = document.getElementById("messages-card");

classesCard.onclick = () => {
  window.location.href =
    getArgs().user.type === "parent"
      ? `/pages/mainPages/classes.html?studentId=${studentId}`
      : "/pages/mainPages/classes.html";
};

profileCard.onclick = () => {
  window.location.href = `/pages/mainPages/detailedStudents.html?studentId=${studentId}`;
};

messagesCard.onclick = () => {
  window.location.href = "/pages/mainPages/messages.html";
};

const reloadAnnouncements = () => {
  const args = getArgs();
  args.updateType = "";
  args.studentId = studentId;
  announcementsWorker.postMessage(args);
};

const reloadHomework = () => {
  const args = getArgs();
  args.updateType = "";
  args.studentId = studentId;
  homeworkWorker.postMessage(args);
};

const reloadClasses = () => {
  const args = getArgs();
  args.updateType = "";
  args.studentId = studentId;
  classesWorker.postMessage(args);
};

const reloadChats = () => {
  const args = getArgs();
  args.updateType = "get";
  messagesWorker.postMessage(args);
};

announcementsWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.announcements) {
    renderAnnouncements(
      e.data.announcements,
      args.isAdmin || args.isTutor,
      () => null,
      () => null
    );
  }
});

homeworkWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.homework) {
    renderHomeworkRows(
      e.data.homework,
      args.isAdmin || args.isTutor,
      () => null,
      () => null
    );
  }
});

classesWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.classes) {
    const classesCount = document.getElementById("classes-count");
    classesCount.textContent = `(${e.data.classes.length})  classes`;
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
  const studentName = document.getElementById("student-name");
  studentName.textContent = user.fullName;

  console.log(studentId, user.type);
  studentId = user.type === "student" ? user.studentId : studentId;
  console.log(studentId, user.type);

  reloadAnnouncements();
  reloadHomework();
  reloadClasses();
  reloadChats();
});
