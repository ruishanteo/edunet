const urlParams = new URLSearchParams(window.location.search);
const classId = parseInt(urlParams.get("classId"));
let classInfo = null;
let tutors = null;

{
  const tutorsWorker = new Worker("/js/workers/tutorsWorker.js");

  const reloadTutors = () => {
    args.updateType = "";
    tutorsWorker.postMessage(args);
  };

  addCallback(reloadTutors);
  tutorsWorker.addEventListener("message", function (e) {
    if (e.data.tutors) {
      tutors = e.data.tutors;
    }
  });
}

{
  const classesWorker = new Worker("/js/workers/classesWorker.js");

  const reloadClass = () => {
    args.classId = classId;
    args.updateType = "get";
    classesWorker.postMessage(args);
  };

  const deleteClass = (params) => {
    args.classId = classId;
    args.updateType = "delete";
    args.updateBody = params;
    classesWorker.postMessage(args);
  };

  const removeStudent = (params) => {
    args.classId = classId;
    args.updateType = "remove";
    args.updateBody = params;
    classesWorker.postMessage(args);
  };

  const assignTutor = (params) => {
    args.updateType = "assign";
    args.updateBody = params;
    classesWorker.postMessage(args);
  };

  addCallback(reloadClass);
  classesWorker.addEventListener("message", function (e) {
    if (e.data.class) {
      classInfo = e.data.class;
      renderClass(e.data.class, (id) => {
        deleteClass({ classId: id });
      });
      renderStudentRows(e.data.class.students, (id) =>
        removeStudent({ studentId: id })
      );
    }

    if (e.data.isDeleted) {
      window.history.back();
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
                tutors &&
                tutors
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
              }
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
      },
      null
    );
  });
}
