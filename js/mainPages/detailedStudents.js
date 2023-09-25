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
  args.isSelf = true;
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
        <label>Full Name</label> <input value="${student?.user?.fullName}" type="name" id="form-name" required/><br />
        <label>Contact No.</label><input value="${student?.contact}" type="num" id="form-contact" required/> <br />
        <label>Parent Full Name</label> <input value="${student?.parent?.user?.fullName}" type="name" id="form-parent-name" required/><br />
        <label>Parent Contact No.</label><input value="${student?.parent?.contact}" type="num" id="form-parent-contact" required/> <br />
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
      },
      null
    );

  const handleDeleteStudent = () => deleteStudent({});

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
            <label>Classes Assigned:</label>
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

        enrollStudent({ classIds });
        close();
      },
      null
    );
  };
  classesWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.classes) {
      return renderClasses(e.data.classes, args, (id) => {
        deleteClass({ classId: id }, handleAddClass);
      });
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
          addModal(
            "Edit Note",
            "edit-note-form",
            `<div class="section">
                <label>Title</label> <input value="${noteInfo.title}" type="text" id="form-title" required/><br />
                <label>Content</label><textarea type="text" id="form-content" rows="20" required>${noteInfo.content}</textarea> <br />
                <button type="submit">Update</button>
            </div>`,
            null,
            (close) => {
              const title = document.getElementById("form-title").value;
              const content = document.getElementById("form-content").value;

              editNote({ noteId: noteInfo.id, title, content });
              close();
            },
            null
          );
        }
      );
    }
  });

  const addNoteButton = document.getElementById("add-note-button");
  addNoteButton.addEventListener("click", (event) => {
    event.preventDefault();
    addModal(
      "Add Note",
      "add-note-form",
      `<div class="section">
          <label>Title</label> <input type="text" id="form-title" required/><br />
          <label>Content</label><input type="text" id="form-content" required/> <br />
          <button type="submit">Create</button>
      </div>`,
      null,
      (close) => {
        const title = document.getElementById("form-title").value;
        const content = document.getElementById("form-content").value;

        createNote({ title, content });
        close();
      },
      null
    );
  });
}

{
  const handleAddAssessment = (classId) =>
    addModal(
      "Add Note",
      "add-note-form",
      `<div class="section">
        <label>Name</label> <input type="text" id="form-name" required/><br />
        <label>Score</label> <input type="number" id="form-score" required/><br />
        <label>Total</label><input type="number" id="form-total" required/> <br />
        <button type="submit">Create</button>
    </div>`,
      null,
      (close) => {
        const name = document.getElementById("form-name").value;
        const score = parseInt(document.getElementById("form-score").value);
        const total = parseInt(document.getElementById("form-total").value);

        createAssessment({ classId, name, score, total });
        close();
      },
      null
    );
  assessmentsWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.assessments) {
      return renderAssessments(
        e.data.assessments,
        student.classes,
        args,
        () => {},
        (assessment) =>
          deleteAssessment({
            assessmentId: assessment.id,
            classId: assessment.classId,
          }),
        handleAddAssessment
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

  reloadStudent();
  reloadNotes();
});
