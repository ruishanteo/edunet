const studentsWorker = new Worker("/js/workers/studentsWorker.js");
const classesWorker = new Worker("/js/workers/classesWorker.js");
let classes = null;

const reloadClasses = () => {
  const args = getArgs();
  args.updateType = "";
  args.tutorId = args.user.tutorId;
  classesWorker.postMessage(args);
};

const reloadStudents = () => {
  const args = getArgs();
  args.updateType = "";
  args.tutorId = args.user.tutorId;
  studentsWorker.postMessage(args);
};

const createStudent = (params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  studentsWorker.postMessage(args);
};

const deleteStudent = (params) => {
  const args = getArgs();
  args.updateType = "delete";
  args.updateBody = params;
  studentsWorker.postMessage(args);
};

const handleAddStudent = () =>
  addModal(
    "Add Student",
    "add-tutor-form",
    `<div class="section">
        <h3 class="content-title">Full Name</h3> <input type="text" id="form-student-name" required/><br />
        <h3 class="content-title">Contact No.</h3><input type="text" id="form-student-contact" required/> <br />
        <h3 class="content-title">Email</h3> <input type="email" id="form-student-email" required/> <br /> 
        <h3 class="content-title">Parent's Full Name</h3> <input type="text" id="form-parent-name" required/> <br />
        <h3 class="content-title">Parent's Contact No.</h3> <input type="text" id="form-parent-contact" required/> <br />
        <h3 class="content-title">Parent's Email</h3><input type="email" id="form-parent-email" required/> <br /> 
        <h3 class="content-title">Classes Enrolled</h3>
        <div>
           <br>
          ${
            classes && classes.length > 0
              ? classes
                  .map(
                    (classInfo) => `
                <div class="class-checkbox-row">
                  <p class="class-checkbox-text">${classInfo.name}</p>
                  <input value="${classInfo.id}"  type="checkbox" name="classes-enrolled" id="classes-enrolled-${classInfo.id}" class="class-checkbox"/>
                </div>`
                  )
                  .join("")
              : "<p>No classes found</p>"
          }
          <br/><br/>
        <div>
        <button type="submit">Create</button>
    </div>`,
    null,
    (close) => {
      const studentFullName =
        document.getElementById("form-student-name").value;
      const studentContact = document.getElementById(
        "form-student-contact"
      ).value;
      const studentEmail = document.getElementById("form-student-email").value;
      const parentFullName = document.getElementById("form-parent-name").value;
      const parentContact = document.getElementById(
        "form-parent-contact"
      ).value;
      const parentEmail = document.getElementById("form-parent-email").value;
      const classesEnrolled = document.getElementsByName("classes-enrolled");

      const classIds = Array.from(classesEnrolled, (classEnrolled) => ({
        id: parseInt(classEnrolled.value),
        checked: classEnrolled.checked,
      }))
        .filter((classEnrolled) => classEnrolled.checked)
        .map((classEnrolled) => classEnrolled.id);

      createStudent({
        classIds,
        studentFullName,
        studentContact,
        studentEmail,
        parentFullName,
        parentContact,
        parentEmail,
      });
      close();
    }
  );

studentsWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.students) {
    renderStudents(
      e.data.students,
      args,
      (id) => deleteStudent({ studentId: id }),
      handleAddStudent
    );
  }
});

classesWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.classes) {
    classes = e.data.classes;
  }
});

addCallback(() => {
  reloadStudents();
  reloadClasses();
});
