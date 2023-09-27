function renderStudents(students, args, handleDelete, handleAddStudent) {
  const studentsGrid = document.getElementById("students-grid");
  if (!studentsGrid) {
    return;
  }

  studentsGrid.innerHTML =
    students.length === 0
      ? `<div class="notFound">
          <img src="/assets/empty.png" alt="eddy" width="350" height="350" />
          <p>No students found.</p>
        </div>
        `
      : "";

  students.forEach((studentInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="subclass">
        <h4><b>${studentInfo.user.fullName}</b></h4>
        ${
          args.isAdmin
            ? `<button class="icon-button" id="action-student-${studentInfo.id}">
              <i class="fa fa-trash"></i>
            </button>`
            : ""
        }
      </div>

      <p><b>Enrolled classes:</b></p>
      ${
        studentInfo.classes.length > 0
          ? studentInfo.classes
              .map((classInfo) => `<p>${classInfo.name}</p>`)
              .join("")
          : "No classes"
      }`;

    card.onclick = (event) => {
      event.stopPropagation();
      window.location.href = `/pages/mainPages/detailedStudents.html?studentId=${studentInfo.id}`;
    };

    studentsGrid.appendChild(card);

    const deleteClassButton = document.getElementById(
      `action-student-${studentInfo.id}`
    );
    if (!deleteClassButton) {
      return;
    }

    deleteClassButton.onclick = (event) => {
      event.stopPropagation();
      handleDelete(studentInfo.id);
    };
  });

  const addStudentButton = document.getElementById("add-student-button");
  if (!args.isAdmin && addStudentButton) {
    addStudentButton.remove();
    return;
  }

  if (addStudentButton) {
    addStudentButton.onclick = (event) => {
      event.preventDefault();
      handleAddStudent();
    };
  }
}

function renderStudent(student, args, handleEdit, handleDelete) {
  const studentFullName = document.getElementById("student-full-name");
  studentFullName.textContent = student.user.fullName;
  const studentEmail = document.getElementById("student-email");
  studentEmail.textContent = student.user.email;
  const studentContact = document.getElementById("student-contact");
  studentContact.textContent = student.contact;

  const parentEmail = document.getElementById("parent-email");
  parentEmail.textContent = student.parent.user.email;
  const parentContact = document.getElementById("parent-contact");
  parentContact.textContent = student.parent.contact;

  const deleteStudentButton = document.getElementById("delete-student-button");
  const editStudentButton = document.getElementById("edit-student-button");

  if (!args.isAdmin) {
    if (deleteStudentButton) deleteStudentButton.remove();
    if (editStudentButton) editStudentButton.remove();
    return;
  }

  if (editStudentButton && handleEdit) {
    editStudentButton.onclick = (event) => {
      event.preventDefault();
      handleEdit();
    };
  }

  if (deleteStudentButton && handleDelete) {
    deleteStudentButton.onclick = (event) => {
      event.preventDefault();
      handleDelete();
    };
  }
}

function renderStudentRows(students, handleDelete) {
  const studentsTable = document.getElementById("students-table");
  studentsTable.innerHTML = `
      <tr>
          <th>No.</th>
          <th>Name</th>
          <th>Contact No.</th>
          <th>Email</th>
          <th>Parent's Contact No.</th>
          <th>Parent's Email</th>
          <th></th>
      </tr>`;

  if (students.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <tr>
              <td colspan="7">No students found</td>
          </tr>`;
    studentsTable.appendChild(row);
  }
  students.map((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <tr>
          <td>${index + 1}</td>
          <td><a href="/pages/mainPages/detailedStudents.html?studentId=${
            student.id
          }">${student.user.fullName}</a></td>
          <td>${student.contact}</td>
          <td>${student.user.email}</td>
          <td>${student.parent.contact}</td>
          <td>${student.parent.user.email}</td>
          <td><button id="remove-student-${
            student.id
          }"><i class="fa fa-close"></i></button></td>
      </tr>`;
    studentsTable.appendChild(row);
    const removeStudentButton = document.getElementById(
      `remove-student-${student.id}`
    );
    removeStudentButton.onclick = (event) => {
      event.stopPropagation();
      handleDelete(student.id);
    };
  });
}
