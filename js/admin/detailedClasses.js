const urlParams = new URLSearchParams(window.location.search);
const classId = parseInt(urlParams.get("classId"));
let classInfo = null;
let tutors = null;

const tutorsWorker = new Worker("/js/workers/tutorsWorker.js");
const classesWorker = new Worker("/js/workers/classesWorker.js");
const announcementsWorker = new Worker("/js/workers/announcementsWorker.js");
const homeworkWorker = new Worker("/js/workers/homeworkWorker.js");

const reloadTutors = () => {
  const args = getArgs();
  args.updateType = "";
  if (!args.isAdmin) {
    return;
  }
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

const reloadHomework = () => {
  const args = getArgs();
  args.updateType = "";
  args.classId = classId;
  homeworkWorker.postMessage(args);
};

const editClass = (params) => {
  const args = getArgs();
  args.updateType = "edit";
  args.updateBody = params;
  args.classId = classId;
  classesWorker.postMessage(args);
};

const createAnnouncement = (classId, params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  args.classId = classId;
  announcementsWorker.postMessage(args);
};

const deleteAnnouncement = (params) => {
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

const createHomework = (classId, params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  args.classId = classId;
  homeworkWorker.postMessage(args);
};

const deleteHomework = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.classId = classId;
  homeworkWorker.postMessage(args);
};

const editHomework = (params) => {
  const args = getArgs();
  args.updateType = "edit";
  args.updateBody = params;
  args.classId = classId;
  homeworkWorker.postMessage(args);
};

const uploadHomeworkGrades = (params) => {
  const args = getArgs();
  args.updateType = "upload";
  args.updateBody = params;
  args.classId = classId;
  homeworkWorker.postMessage(args);
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
      reloadHomework();
      reloadAnnouncements();
      if (
        args.isAdmin ||
        (args.isTutor &&
          e.data.class.tutors.length > 0 &&
          e.data.class.tutors[0].id === args.user.tutorId)
      ) {
        renderStudentRows(e.data.class.students, args.isAdmin, (id) =>
          removeStudent({ studentId: id })
        );
      } else {
        removeAllControls();
      }
      renderClass(e.data.class, args, (id) =>
        addConfirmModal("delete a class", "delete-class", () =>
          deleteClass({ classId: id })
        )
      );

      const messageTutorButton = document.getElementById(
        "message-tutor-button"
      );
      if (messageTutorButton) {
        if ((args.isTutor && !args.isAdmin) || classInfo.tutors.length === 0) {
          messageTutorButton.remove();
        } else {
          messageTutorButton.onclick = (event) => {
            event.preventDefault();
            window.location.href = `/pages/mainPages/detailedMessage.html?receiverId=${classInfo.tutors[0].user.id}`;
          };
        }
      }
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
          <h3 class="content-title">Tutors:</h3>
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

  const editClassButton = document.getElementById("edit-class-button");
  if (editClassButton) {
    editClassButton.addEventListener("click", (event) => {
      event.preventDefault();
      addModal(
        "Edit Class Information",
        "edit-class-form",
        `<div class="section">
            <h3 class="content-title">Name</h3> <input value="${classInfo.name}" type="text" id="form-name" maxlength="100" required/><br />
            <h3 class="content-title">Day</h3> <input <input value="${classInfo.day}" type="text" id="form-day" maxlength="100" required/><br />
            <h3 class="content-title">Time</h3> <input <input value="${classInfo.time}" type="text" id="form-time" maxlength="100" required/><br />
            <h3 class="content-title">Venue</h3> <input <input value="${classInfo.venue}" type="text" id="form-venue" maxlength="100" required/><br />
            <button type="submit">Update</button>
        </div>`,
        null,
        (close) => {
          const name = document.getElementById("form-name").value;
          const day = document.getElementById("form-day").value;
          const time = document.getElementById("form-time").value;
          const venue = document.getElementById("form-venue").value;

          editClass({
            classId,
            name,
            day,
            time,
            venue,
          });
          close();
        }
      );
    });
  }
}

{
  announcementsWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.announcements) {
      renderAnnouncements(
        e.data.announcements,
        args.isAdmin ||
          (args.isTutor && classInfo.tutors[0].id === args.user.tutorId),
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

  const addAnnouncementButton = document.getElementById(
    "add-announcement-button"
  );
  addAnnouncementButton.addEventListener("click", (event) => {
    event.preventDefault();
    addModal(
      "Add Announcement",
      "add-announcement-form",
      `<div class="section">
            <h3 class="content-title">Title</h3> <input type="text" id="form-title" maxlength="50" required/><br />
            <h3 class="content-title">Content</h3> <textarea type="text" id="form-content" rows="20" maxlength="2500" required></textarea> <br />
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

{
  homeworkWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.homework) {
      renderHomeworkRows(
        e.data.homework,
        args.isAdmin ||
          (args.isTutor && classInfo.tutors[0].id === args.user.tutorId),
        (id) => deleteHomework({ homeworkId: id }),
        (id, title, description, dueDate) =>
          editHomework({
            homeworkId: id,
            title,
            description,
            dueDate,
          }),
        (homework, total, file) => {
          const reader = new FileReader();

          reader.onload = function (e) {
            const content = e.target.result;
            const lines = content.split("\n");

            const headers = lines[0].replace("\r", "").split(",");

            const data = [];

            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(",");
              const entry = {};

              for (let j = 0; j < headers.length; j++) {
                const cleanedValue = values[j].replace("\r", "");
                entry[headers[j]] = cleanedValue;
              }

              data.push(entry);
            }

            uploadHomeworkGrades({
              homeworkId: homework.id,
              assessmentName: homework.title,
              total: parseInt(total),
              data,
            });
          };

          reader.readAsText(file);
        },
        (homeworkTitle) => {
          const students = classInfo.students;
          const csvRows = students.map(
            (student) => `${student.id},${student.user.fullName},`
          );
          csvRows.splice(0, 0, "Student ID,Student Name,Score");
          const csv = csvRows.join("\n");
          const csvContent = `data:text/csv;charset=utf-8,${csv}`;
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `${homeworkTitle}.csv`);
          document.body.appendChild(link);
          link.click();
        }
      );
    }
  });

  const addHomeworkButton = document.getElementById("add-homework-button");
  addHomeworkButton.addEventListener("click", (event) => {
    event.preventDefault();
    addModal(
      "Add Homework",
      "add-homework-form",
      `<div class="section">
            <h3 class="content-title">Title</h3> <input type="text" id="form-title" maxlength="100" required/><br />
            <h3 class="content-title">Description</h3> <textarea type="text" id="form-description" rows="20" maxlength="1000" required></textarea> <br />
            <h3 class="content-title">Due Date</h3> <input type="datetime-local" id="form-due-date" required/><br />
            <button type="submit">Add</button>
        </div>`,
      null,
      (close) => {
        const title = document.getElementById("form-title").value;
        const description = document.getElementById("form-description").value;
        const dueDate = document.getElementById("form-due-date").value;

        createHomework(classId, { title, description, dueDate });
        close();
      }
    );
  });
}

function removeAllControls() {
  const rightControls = document.querySelectorAll(".tab__right_controls");
  rightControls.forEach((control) => control.remove());

  const studentsTab = document.querySelectorAll("#Students");
  studentsTab.forEach((tab) => tab.remove());
}

addCallback(() => {
  reloadClass();
  reloadTutors();

  if (!args.isAdmin) {
    if (!args.isTutor) {
      removeAllControls();
    }

    const adminOnly = document.querySelectorAll("#admin-only");
    adminOnly.forEach((tab) => tab.remove());

    const editClassButton = document.getElementById("edit-tutor-button");
    editClassButton.remove();

    const deleteClassButton = document.getElementById("delete-class-button");
    deleteClassButton.remove();
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

  setTimeout(() => {
    offsetMenuBorder(activeItem, menuBorder);
  }, 100);

  menuItems.forEach((item, index) => {
    item.addEventListener("click", () => clickItem(item, index));
  });

  window.addEventListener("resize", () => {
    offsetMenuBorder(activeItem, menuBorder);
    menu.style.setProperty("--timeOut", "none");
  });
});
