let hasAuthenticated = false;
const authWorker = new Worker("/js/workers/authWorker.js");

function containsKeywords(url) {
  const keywords = /(admin|mainPages)/;
  return keywords.test(url);
}

function getHomePage(user) {
  if (!user) {
    return "/";
  }
  if (user.type === "student") {
    return `/pages/mainPages/detailedStudents.html?studentId=${user.studentId}`;
  } else if (user.type === "parent") {
    return `/pages/mainPages/detailedParents.html?parentId=${user.tutorId}`;
  } else if (user.type === "tutor") {
    return `/pages/mainPages/detailedTutors.html?tutorId=${user.tutorId}`;
  } else if (user.type === "admin") {
    return `/pages/admin/home.html`;
  }
  return "/pages/mainPages/notFound.html";
}

const URL = "https://edunet.dynv6.net";
const args = getArgs();

function getArgs() {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    isAdmin: user && user.type === "admin",
    isTutor: user && (user.type === "admin" || user.type === "tutor"),
    homePageURL: getHomePage(user),
    studentId: null,
    tutorId: null,
    classId: null,
    baseUrl: `${URL}/api`,
    publicUrl: `${URL}/public`,
    accessToken: localStorage.getItem("accessToken"),
    user: user,

    updateType: "",
    updateBody: null,
  };
}

function addCallback(callback) {
  if (hasAuthenticated) {
    return callback(getArgs());
  }

  authWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.failedAuthentication) {
      if (containsKeywords(window.location.href)) {
        window.location.href = "/";
      }
      localStorage.clear();
    }

    if (e.data.authenticated) {
      hasAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(e.data.user));
      callback(getArgs());
    }

    if (
      e.data.message == "User logged in successfully" ||
      e.data.message == "User registered successfully"
    ) {
      localStorage.setItem("accessToken", e.data.tokens.accessToken);
      localStorage.setItem("user", JSON.stringify(e.data.user));
      window.location.href = getHomePage(e.data.user);
    }
  });
  authWorker.postMessage(args);
}

function setupLoadingIndicator() {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "/css/loadingIcon.css";
  document.head.appendChild(link);

  const loaderContainer = document.createElement("div");
  loaderContainer.classList.add("loader-window");
  loaderContainer.id = "loader-window";
  loaderContainer.innerHTML = `
  <div class="loader-container">
    <div class="bear">
      <img src="/assets/icon.png" class="loader-icon" alt="eddy" />
    </div>
    <div class="bush">
      <div class="bush-part"></div>
      <div class="bush-part"></div>
      <div class="bush-part"></div>
    </div>
    <div class="loader-dots-container">
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
    </div>
  </div>`;
  document.body.appendChild(loaderContainer);

  loaderContainer.classList.add("hidden");
  loaderContainer.addEventListener(
    "transitionend",
    function () {
      if (this.className == "fadeout") {
        this.style.display = "none";
      }
    }.bind(loaderContainer)
  );

  let currLoadingCount = 0;

  return function (status) {
    if (status) {
      currLoadingCount += 1;
      loaderContainer.classList.remove("hidden");
      loaderContainer.classList.add("is-loading");
    } else {
      currLoadingCount -= 1;
      if (currLoadingCount === 0) {
        loaderContainer.classList.add("hidden");
        loaderContainer.classList.remove("is-loading");
      }
    }
  };
}

function setupSnackbar() {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "/css/snackbar.css";
  document.head.appendChild(link);

  const snackbarContainer = document.createElement("div");
  snackbarContainer.id = "snackbar";
  document.body.appendChild(snackbarContainer);

  let notifId = 0;

  return function (msg, type) {
    snackbarContainer.classList.add("show", type);
    const currNotifId = ++notifId;
    snackbarContainer.textContent = msg;

    setTimeout(function () {
      if (notifId === currNotifId) {
        snackbarContainer.classList.remove("show", type);
      }
    }, 3000);
  };
}

const setLoadingStatus = setupLoadingIndicator();

function handleNotifications(e) {
  if (e.data.message) {
    const msg = e.data.message.toLowerCase();
    if (!msg.includes("view")) {
      const type = msg.includes("success") ? "success" : "error";
      showStatus(e.data.message, type);
    }
  }
  if (e.data.isLoading) {
    setLoadingStatus(true);
  }

  if (e.data.doneLoading) {
    setLoadingStatus(false);
  }

  if (e.data.errorResponse) {
    setLoadingStatus(false);
    showStatus(e.data.errorResponse.message, "error");
  }

  if (e.data.failedGet || e.data.isDeleted) {
    if (window.location.href !== document.referrer) {
      window.location.href = document.referrer;
    } else {
      window.location.href = getHomePage(getArgs().user);
    }
  }
}
const showStatus = setupSnackbar();
