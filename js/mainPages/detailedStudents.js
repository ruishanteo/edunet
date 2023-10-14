const urlParams = new URLSearchParams(window.location.search);
const studentId = parseInt(urlParams.get("studentId"));
let classes = null;
let student = null;

const studentsWorker = new Worker("/js/workers/studentsWorker.js");
const classesWorker = new Worker("/js/workers/classesWorker.js");
const notesWorker = new Worker("/js/workers/notesWorker.js");
const assessmentsWorker = new Worker("/js/workers/assessmentsWorker.js");

const reloadStudent = () => {
  const args = getArgs();
  args.updateType = "get";
  args.studentId = studentId;
  studentsWorker.postMessage(args);
};

const editStudent = (params) => {
  const args = getArgs();
  args.updateType = "edit";
  args.updateBody = params;
  args.studentId = studentId;
  studentsWorker.postMessage(args);
};

const deleteStudent = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.studentId = studentId;
  studentsWorker.postMessage(args);
};

const reloadClasses = () => {
  const args = getArgs();
  args.updateType = "";
  args.studentId = studentId;
  classesWorker.postMessage(args);
};

const deleteClass = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.studentId = studentId;
  classesWorker.postMessage(args);
};

const enrollStudent = (params) => {
  const args = getArgs();
  args.updateType = "enroll";
  args.updateBody = params;
  args.studentId = studentId;
  classesWorker.postMessage(args);
};

const reloadNotes = () => {
  const args = getArgs();
  args.updateType = "";
  args.studentId = studentId;
  notesWorker.postMessage(args);
};

const createNote = (params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  args.studentId = studentId;
  notesWorker.postMessage(args);
};

const editNote = (params) => {
  const args = getArgs();
  args.updateType = "edit";
  args.updateBody = params;
  args.studentId = studentId;
  notesWorker.postMessage(args);
};

const deleteNote = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.studentId = studentId;
  notesWorker.postMessage(args);
};

const reloadAssessments = () => {
  const args = getArgs();
  args.updateType = "";
  args.studentId = studentId;
  assessmentsWorker.postMessage(args);
};

const createAssessment = (params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  args.studentId = studentId;
  assessmentsWorker.postMessage(args);
};

const editAssessment = (params) => {
  const args = getArgs();
  args.updateType = "edit";
  args.updateBody = params;
  args.studentId = studentId;
  assessmentsWorker.postMessage(args);
};

const deleteAssessment = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  args.studentId = studentId;
  assessmentsWorker.postMessage(args);
};

{
  const handleEditStudent = () =>
    addModal(
      "Edit Student",
      "edit-student-form",
      `<div class="section">
        <h3 class="content-title">Full Name</h3> <input value="${student?.user?.fullName}" type="name" id="form-name" required/><br />
        <h3 class="content-title">Contact No.</h3> <input value="${student?.contact}" type="num" id="form-contact" required/> <br />
        <h3 class="content-title">Parent's Full Name</h3> <input value="${student?.parent?.user?.fullName}" type="name" id="form-parent-name" required/><br />
        <h3 class="content-title">Parent's Contact No.</h3> <input value="${student?.parent?.contact}" type="num" id="form-parent-contact" required/> <br />
        <button type="submit">Update</button>
      </div>`,
      null,
      (close) => {
        const fullName = document.getElementById("form-name").value;
        const contact = document.getElementById("form-contact").value;
        const parentFullName =
          document.getElementById("form-parent-name").value;
        const parentContact = document.getElementById(
          "form-parent-contact"
        ).value;

        editStudent({
          studentFullName: fullName,
          studentContact: contact,
          parentFullName: parentFullName,
          parentContact: parentContact,
        });
        close();
      }
    );

  const handleDeleteStudent = () =>
    addConfirmModal("delete a student", "delete-student", () =>
      deleteStudent({})
    );

  studentsWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.student) {
      reloadClasses();
      reloadAssessments();
      student = e.data.student;
      return renderStudent(
        e.data.student,
        args,
        handleEditStudent,
        handleDeleteStudent
      );
    }
  });
}

{
  const handleAddClass = () => {
    const currentClassesEnrolledMap = (student?.classes || []).reduce(
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
                classes && classes.length > 0
                  ? classes
                      .map(
                        (classInfo) => `
                      <div class="class-checkbox-row">
                        <p class="class-checkbox-text">${classInfo.name}</p>
                        
                        <input class="class-checkbox" 
                        ${
                          currentClassesEnrolledMap[classInfo.id] &&
                          "checked='true'"
                        }" 
                          value="${classInfo.id}"
                          type="checkbox" name="classes-enrolled" id="classes-enrolled-${
                            classInfo.id
                          }" />
                      </div>`
                      )
                      .join("")
                  : "<p>No classes found</p>"
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

        enrollStudent({ classIds });
        close();
      }
    );
  };
  classesWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.isAssigned) {
      reloadStudent();
      reloadAssessments();
    }

    if (e.data.classes) {
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
  if (!getArgs().isTutor) {
    addNoteButton.remove();
  } else {
    addNoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      addModal(
        "Add Note",
        "add-note-form",
        `<div class="section">
          <h3 class="content-title">Title</h3> <input type="text" id="form-title" maxlength="100" required/><br />
          <h3 class="content-title">Content</h3><textarea type="text" id="form-content" rows="20" maxlength="2500" required></textarea> <br />
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
  const handleAddAssessment = (classId) =>
    addModal(
      "Add Assessment",
      "add-assessment-form",
      `<div class="section">
        <h3 class="content-title">Name</h3> <input type="text" id="form-name" maxlength="30" required/><br />
        <h3 class="content-title">Score</h3> <input type="number" id="form-score" min="0" max="9999" required/><br />
        <h3 class="content-title">Score</h3> <input type="number" id="form-total" min="0" max="9999" required/> <br />
        <button type="submit">Create</button>
    </div>`,
      null,
      (close) => {
        const name = document.getElementById("form-name").value;
        const score = parseInt(document.getElementById("form-score").value);
        const total = parseInt(document.getElementById("form-total").value);

        createAssessment({ classId, name, score, total });
        close();
      }
    );

  const handleEditAssessment = (assessment) =>
    addModal(
      "Update Assessment",
      "add-assessment-form",
      `<div class="section">
        <h3 class="content-title">Name</h3> <input value=${assessment.name} type="text" id="form-name" required/><br />
        <h3 class="content-title">Score</h3> <input value=${assessment.score} type="number" id="form-score" required/><br />
        <h3 class="content-title">Score</h3> <input value=${assessment.total} type="number" id="form-total" required/> <br />
        <button type="submit">Update</button>
    </div>`,
      null,
      (close) => {
        const name = document.getElementById("form-name").value;
        const score = parseInt(document.getElementById("form-score").value);
        const total = parseInt(document.getElementById("form-total").value);

        editAssessment({
          classId: assessment.classId,
          assessmentId: assessment.id,
          name,
          score,
          total,
        });
        close();
      }
    );
  assessmentsWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.assessments) {
      return renderAssessments(
        e.data.assessments,
        student.classes,
        args,
        handleEditAssessment,
        (assessment) =>
          addConfirmModal("delete a assessment", "delete-assessment", () =>
            deleteAssessment({
              assessmentId: assessment.id,
              classId: assessment.classId,
            })
          ),
        handleAddAssessment
      );
    }
  });
}

function fetchAllClasses() {
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
}

addCallback((args) => {
  fetchAllClasses();
  reloadStudent();
  reloadNotes();
});
