const urlParams = new URLSearchParams(window.location.search);
const classId = parseInt(urlParams.get("classId"));
let classInfo = null;
let tutors = null;

const tutorsWorker = new Worker("/js/workers/tutorsWorker.js");
const classesWorker = new Worker("/js/workers/classesWorker.js");
const announcementsWorker = new Worker("/js/workers/announcementsWorker.js");

const reloadTutors = () => {
  const args = getArgs();
  args.updateType = "";
  tutorsWorker.postMessage(args);
};

const reloadClass = () => {
  const args = getArgs();
  args.updateType = "get";
  args.classId = classId;
  classesWorker.postMessage(args);
};

const reloadAnnouncements = () => {
  const args = getArgs();
  args.updateType = "";
  args.classId = classId;
  announcementsWorker.postMessage(args);
};

const createAnnouncement = (classId, params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  args.classId = classId;
  announcementsWorker.postMessage(args);
};

const deleteAnnouncement = (params) => {
  console.log(params);
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.classId = classId;
  announcementsWorker.postMessage(args);
};

const editAnnouncement = (params) => {
  const args = getArgs();
  args.updateType = "edit";
  args.updateBody = params;
  args.classId = classId;
  announcementsWorker.postMessage(args);
};

const deleteClass = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.classId = classId;
  classesWorker.postMessage(args);
};

const removeStudent = (params) => {
  const args = getArgs();
  args.updateType = "remove";
  args.updateBody = params;
  args.classId = classId;
  classesWorker.postMessage(args);
};

const assignTutor = (params) => {
  const args = getArgs();
  args.updateType = "assign";
  args.updateBody = params;
  args.classId = classId;
  classesWorker.postMessage(args);
};

{
  tutorsWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.tutors) {
      tutors = e.data.tutors;
    }
  });
}

{
  classesWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.class) {
      classInfo = e.data.class;
      renderClass(e.data.class, (id) =>
        addConfirmModal("delete a class", "delete-class", () =>
          deleteClass({ classId: id })
        )
      );
      renderStudentRows(e.data.class.students, (id) =>
        removeStudent({ studentId: id })
      );
    }
  });

  const addClassButton = document.getElementById("edit-tutor-button");
  addClassButton.addEventListener("click", (event) => {
    event.preventDefault();
    const currentAssignedTutorMap = (classInfo?.tutors || []).reduce(
      (dict, tutor) => {
        dict[tutor.id] = true;
        return dict;
      },
      {}
    );
    addModal(
      "Assign Tutor",
      "assign-tutor-form",
      `<div class="section">
            <label>Tutors:</label>
            <div>
             <br>
              ${
                tutors && tutors.length > 0
                  ? tutors
                      .map(
                        (tutor) => `
                      <div class="class-checkbox-row">
                        <p class="class-checkbox-text">${
                          tutor.user.fullName
                        }</p>
                        
                        <input ${
                          currentAssignedTutorMap[tutor.id] && "checked='true'"
                        }" value="${
                          tutor.id
                        }"  type="radio" name="assigned-tutor" id="assigned-tutor-${
                          tutor.id
                        }" class="class-checkbox"/>
                      </div>`
                      )
                      .join("")
                  : "<p>No tutors found</p>"
              }
              <br/><br/>
            <div>
            <button type="submit">Assign</button>
        </div>`,
      null,
      (close) => {
        const assignedTutors = document.getElementsByName("assigned-tutor");

        const tutorIds = Array.from(assignedTutors, (tutor) => ({
          id: parseInt(tutor.value),
          checked: tutor.checked,
        }))
          .filter((classEnrolled) => classEnrolled.checked)
          .map((classEnrolled) => classEnrolled.id);

        assignTutor({ tutorId: tutorIds[0], classIds: [classId] });
        close();
      }
    );
  });
}

{
  announcementsWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.announcements) {
      renderAnnouncements(
        e.data.announcements,
        args.isAdmin || args.isTutor,
        (id) => deleteAnnouncement({ announcementId: id }),
        (id, title, content) =>
          editAnnouncement({
            announcementId: id,
            title,
            content,
          })
      );
    }
  });
}

addCallback(() => {
  reloadClass();
  reloadTutors();
  reloadAnnouncements();

  if (!args.isAdmin && !args.isTutor) {
    const rightControls = document.querySelectorAll(".tab__right_controls");
    rightControls.forEach((control) => control.remove());
  }
});

window.addEventListener("load", function () {
  const body = document.body;
  const menu = body.querySelector(".tab__menu");
  const menuItems = menu.querySelectorAll(".menu__item");
  const menuBorder = menu.querySelector(".menu__border");
  let activeItem = menu.querySelector(".active");

  const tabTitle = body.querySelector(".tab__title");
  const tabItems = body.querySelectorAll(".tab__content__item");

  function clickItem(item, index) {
    menu.style.removeProperty("--timeOut");

    if (activeItem == item) return;

    if (activeItem) {
      activeItem.classList.remove("active");
    }

    item.classList.add("active");
    tabTitle.textContent = item.id;
    tabItems.forEach((tabItem) => {
      if (tabItem.id === item.id) {
        tabItem.classList.add("tab_active");
      } else {
        tabItem.classList.remove("tab_active");
      }
    });
    activeItem = item;
    offsetMenuBorder(activeItem, menuBorder);
  }

  function offsetMenuBorder(element, menuBorder) {
    const offsetActiveItem = element.getBoundingClientRect();
    const left =
      Math.floor(
        offsetActiveItem.left -
          menu.offsetLeft -
          (menuBorder.offsetWidth - offsetActiveItem.width) / 2
      ) + "px";
    menuBorder.style.transform = `translate3d(${left}, 0 , 0)`;
  }

  offsetMenuBorder(activeItem, menuBorder);

  menuItems.forEach((item, index) => {
    item.addEventListener("click", () => clickItem(item, index));
  });

  window.addEventListener("resize", () => {
    offsetMenuBorder(activeItem, menuBorder);
    menu.style.setProperty("--timeOut", "none");
  });
});

{
  const addAnnouncementButton = document.getElementById(
    "add-announcement-button"
  );
  addAnnouncementButton.addEventListener("click", (event) => {
    event.preventDefault();
    addModal(
      "Add Announcement",
      "add-announcement-form",
      `<div class="section">
            <label>Title</label> <input type="text" id="form-title" maxlength="100" required/><br />
            <label>Content</label><textarea type="text" id="form-content" rows="20" maxlength="2500" required></textarea> <br />
            <button type="submit">Add</button>
        </div>`,
      null,
      (close) => {
        const title = document.getElementById("form-title").value;
        const content = document.getElementById("form-content").value;

        createAnnouncement(classId, { title, content });
        close();
      }
    );
  });
}
