const urlParams = new URLSearchParams(window.location.search);
const tutorId = parseInt(urlParams.get("tutorId"));
let classes = null;
let tutor = null;

const tutorsWorker = new Worker("/js/workers/tutorsWorker.js");
const notesWorker = new Worker("/js/workers/notesWorker.js");
const classesWorker = new Worker("/js/workers/classesWorker.js");
const studentsWorker = new Worker("/js/workers/studentsWorker.js");

const reloadClasses = () => {
  const args = getArgs();
  args.updateType = "";
  args.tutorId = tutorId;
  classesWorker.postMessage(args);
};

const deleteClass = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.tutorId = tutorId;
  classesWorker.postMessage(args);
};

const assignTutor = (params) => {
  const args = getArgs();
  args.updateType = "assign";
  args.updateBody = params;
  args.tutorId = tutorId;
  classesWorker.postMessage(args);
};

const reloadTutor = () => {
  const args = getArgs();
  args.updateType = "get";
  args.tutorId = tutorId;
  tutorsWorker.postMessage(args);
};

const editTutor = (params) => {
  const args = getArgs();
  args.updateType = "edit";
  args.updateBody = params;
  args.tutorId = tutorId;
  tutorsWorker.postMessage(args);
};

const deleteTutor = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.tutorId = tutorId;
  tutorsWorker.postMessage(args);
};

const reloadNotes = () => {
  const args = getArgs();
  args.updateType = "";
  args.tutorId = tutorId;
  notesWorker.postMessage(args);
};

const createNote = (params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  args.tutorId = tutorId;
  notesWorker.postMessage(args);
};

const editNote = (params) => {
  const args = getArgs();
  args.updateType = "edit";
  args.updateBody = params;
  args.tutorId = tutorId;
  notesWorker.postMessage(args);
};

const deleteNote = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.tutorId = tutorId;
  notesWorker.postMessage(args);
};

const reloadStudents = () => {
  const args = getArgs();
  args.updateType = "";
  args.tutorId = tutorId;
  studentsWorker.postMessage(args);
};

const deleteStudent = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  studentsWorker.postMessage(args);
};

{
  const handleEdit = () => {
    addModal(
      "Edit Tutor",
      "edit-tutor-form",
      `<div class="section">
      <label>Full Name</label> <input value="${tutor?.user?.fullName}" type="name" id="form-name" required/><br />
      <label>Contact No.</label><input value="${tutor?.contact}" type="num" id="form-contact" required/> <br />
      <button type="submit">Update</button>
    </div>`,
      null,
      (close) => {
        const fullName = document.getElementById("form-name").value;
        const contact = document.getElementById("form-contact").value;

        editTutor({ fullName: fullName, contact: contact });
        close();
      }
    );
  };

  const handleDelete = () =>
    addConfirmModal("delete a tutor", "delete-tutor", () => deleteTutor({}));
  tutorsWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.tutor) {
      tutor = e.data.tutor;
      return renderTutor(e.data.tutor, args, handleEdit, handleDelete);
    }
  });
}

{
  const handleAddClass = () => {
    const currentClassesEnrolledMap = (tutor?.classes || []).reduce(
      (dict, classInfo) => {
        dict[classInfo.id] = true;
        return dict;
      },
      {}
    );
    addModal(
      "Add Class",
      "add-class-form",
      `<div class="section">
        <h3 class="content-title">Classes Assigned:</h3>
            <div>
             <br>
              ${
                classes &&
                classes
                  .map(
                    (classInfo) => `
                      <div class="class-checkbox-row">
                        <p class="class-checkbox-text">${classInfo.name}</p>

                        <input ${
                          currentClassesEnrolledMap[classInfo.id] &&
                          "checked='true'"
                        }" value="${
                      classInfo.id
                    }"  type="checkbox" name="classes-enrolled" id="classes-enrolled-${
                      classInfo.id
                    }" class="class-checkbox"/>
                      </div>`
                  )
                  .join("")
              }
            <div>
            <button type="submit">Assign</button>
        </div>`,
      null,
      (close) => {
        const classesEnrolled = document.getElementsByName("classes-enrolled");

        const classIds = Array.from(classesEnrolled, (classEnrolled) => ({
          id: parseInt(classEnrolled.value),
          checked: classEnrolled.checked,
        }))
          .filter((classEnrolled) => classEnrolled.checked)
          .map((classEnrolled) => classEnrolled.id);

        assignTutor({ classIds });
        close();
      }
    );
  };
  classesWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.isAssigned) {
      reloadTutor();
    }

    if (e.data.classes) {
      reloadTutor();
      return renderClasses(
        e.data.classes,
        args,
        (id) => {
          deleteClass({ classId: id });
        },
        handleAddClass
      );
    }
  });
}

{
  notesWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.notes) {
      return renderNotes(
        e.data.notes,
        args,
        (id) => deleteNote({ noteId: id }),
        (noteInfo) => {
          const canEdit = args.isAdmin || args.user.id === noteInfo.creatorId;
          addModal(
            canEdit ? "Edit Note" : "View Note",
            "edit-note-form",
            canEdit
              ? `<div class="section">
              <h3 class="content-title">Title</h3> <input value="${noteInfo.title}" type="text" id="form-title" maxlength="100" required/><br />
              <h3 class="content-title">Content</h3> <textarea type="text" id="form-content" rows="20" maxlength="2500" required>${noteInfo.content}</textarea> <br />
              <button type="submit">Update</button>
            </div>`
              : `<div class="section">
                <h3 class="content-title">Title</h3> <p class="content-title">${noteInfo.title}</p><br />
                <h3 class="content-title">Content</h3> <p class="content-text">${noteInfo.content}</p><br />
                <label>Created by ${noteInfo.creator.fullName}</label><br />
              </div>`,
            null,
            canEdit
              ? (close) => {
                  const title = document.getElementById("form-title").value;
                  const content = document.getElementById("form-content").value;

                  editNote({ noteId: noteInfo.id, title, content });
                  close();
                }
              : null
          );
        }
      );
    }
  });

  const addNoteButton = document.getElementById("add-note-button");
  if (!args.isAdmin) {
    addNoteButton.remove();
  } else {
    addNoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      addModal(
        "Add Note",
        "add-note-form",
        `<div class="section">
        <h3 class="content-title">Title</h3> <input type="text" id="form-title" maxlength="100" required/><br />
        <h3 class="content-title">Content</h3> <textarea type="text" id="form-content" rows="20" maxlength="2500" required></textarea> <br />
        <button type="submit">Create</button>
      </div>`,

        null,
        (close) => {
          const title = document.getElementById("form-title").value;
          const content = document.getElementById("form-content").value;

          createNote({ title, content });
          close();
        }
      );
    });
  }
}

{
  studentsWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.students) {
      renderStudents(
        e.data.students,
        args,
        (id) => deleteStudent({ studentId: id }),
        () => null
      );
    }
  });
}

addCallback((args) => {
  if (args.isAdmin) {
    fetch(`${args.baseUrl}/class`, {
      method: "GET",
      headers: {
        Authorization: `${args.accessToken}`,
        "Content-Type": "application/json",
      },
    }).then((ret) =>
      ret.json().then((res) => {
        classes = res.classes;
      })
    );
  }

  reloadClasses();
  reloadNotes();
  reloadStudents();
});
