const urlParams = new URLSearchParams(window.location.search);
const tutorId = parseInt(urlParams.get("tutorId"));
let classes = null;
let tutor = null;

{
  const response = await fetch(`${args.baseUrl}/class`, {
    method: "GET",
    headers: {
      Authorization: `${args.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  response.json().then((res) => {
    classes = res.classes;
  });
}

const tutorsWorker = new Worker("/js/workers/tutorsWorker.js");

const reloadTutor = () => {
  args.tutorId = tutorId;
  args.updateType = "get";
  tutorsWorker.postMessage(args);
};

const editTutor = (params) => {
  args.updateType = "edit";
  args.updateBody = params;
  tutorsWorker.postMessage(args);
};

const deleteTutor = (params) => {
  args.updateType = "delete";
  args.updateBody = params;
  tutorsWorker.postMessage(args);
};

addCallback(reloadTutor);
tutorsWorker.addEventListener("message", function (e) {
  if (e.data.tutor) {
    tutor = e.data.tutor;
    return renderTutor(e.data.tutor);
  }
  if (e.data.isDeleted) {
    window.history.back();
  }
});

const deleteTutorButton = document.getElementById("delete-tutor-button");
deleteTutorButton.addEventListener("click", (event) => {
  event.preventDefault();
  deleteTutor({});
});

const editTutorButton = document.getElementById("edit-tutor-button");
editTutorButton.addEventListener("click", (event) => {
  event.preventDefault();
  addModal(
    "Edit Tutor",
    "edit-tutor-form",
    `<div class="section">
        <label>Full Name</label> <input value="${tutor?.user?.fullName}" type="name" id="form-name" required/><br />
        <label>Contact No.</label><input value="${tutor?.contact}" type="num" id="form-contact" required/> <br />
        <label>Email</label><input value="${tutor?.user?.email}" type="email" id="form-email" required/> <br /> 
        <button type="submit">Update</button>
      </div>`,
    null,
    (close) => {
      const fullName = document.getElementById("form-name").value;
      const contact = document.getElementById("form-contact").value;
      const email = document.getElementById("form-email").value;

      editTutor({ fullName: fullName, contact: contact, email: email });
      close();
    },
    null
  );
});

{
  const classesWorker = new Worker("/js/workers/classesWorker.js");
  const reloadClasses = () => {
    args.tutorId = tutorId;
    args.updateType = "";
    classesWorker.postMessage(args);
  };

  const deleteClass = (params) => {
    args.updateType = "delete";
    args.updateBody = params;
    classesWorker.postMessage(args);
  };

  const assignTutor = (params) => {
    args.updateType = "assign";
    args.updateBody = params;
    classesWorker.postMessage(args);
  };

  addCallback(reloadClasses);
  classesWorker.addEventListener("message", function (e) {
    if (e.data.classes) {
      reloadTutor();
      return renderClasses(e.data.classes, args, (id) => {
        deleteClass({ classId: id });
      });
    }
    window.history.back();
  });

  const addClassButton = document.getElementById("add-class-button");
  addClassButton.addEventListener("click", (event) => {
    event.preventDefault();
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

        assignTutor({ classIds });
        close();
      },
      null
    );
  });
}

{
  const notesWorker = new Worker("/js/workers/notesWorker.js");

  const reloadNotes = () => {
    args.tutorId = tutorId;
    args.updateType = "";
    notesWorker.postMessage(args);
  };

  const createNote = (params) => {
    args.tutorId = tutorId;
    args.updateType = "create";
    args.updateBody = params;
    notesWorker.postMessage(args);
  };

  const editNote = (params) => {
    args.updateType = "edit";
    args.updateBody = params;
    notesWorker.postMessage(args);
  };

  const deleteNote = (params) => {
    args.updateType = "delete";
    args.updateBody = params;
    notesWorker.postMessage(args);
  };

  addCallback(reloadNotes);
  notesWorker.addEventListener("message", function (e) {
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
    window.history.back();
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
