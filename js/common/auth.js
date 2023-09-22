const authWorker = new Worker("/js/workers/authWorker.js");

const args = {
  canEdit: true,
  isAdmin: true,
  studentId: null,
  tutorId: null,
  baseUrl: "https://edunet.onrender.com/api",
  accessToken: localStorage.getItem("accessToken"),
  user: JSON.parse(localStorage.getItem("user")),

  updateType: "",
  updateBody: null,
};

function addCallback(callback) {
  authWorker.addEventListener("message", function (e) {
    if (e.data.authenticated) {
      localStorage.setItem("user", JSON.stringify(e.data.user));
      callback(args);
    } else {
      localStorage.clear();
    }
  });
  authWorker.postMessage(args);
}
