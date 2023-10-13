function renderStudents(students, args, handleDelete, handleAddStudent) {
  const studentsGrid = document.getElementById("students-grid");
  const colors = [
    "#DAC4F7",
    "#D6F6DD",
    "#F4989C",
    "#ACECF7",
    "#DEE7E7",
    "#D0A5C0",
    "#F0B7B3",
  ];

  if (!studentsGrid) {
    return;
  }

  studentsGrid.innerHTML =
    students.length === 0
      ? `<div class="notFound">
          <img src="/assets/empty.png" alt="eddy" width="200" height="200" />
          <p>No students found.</p>
        </div>
        `
      : "";

  students.forEach((studentInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const enrolledClasses = studentInfo.classes
      .map((classInfo) => `${classInfo.name}`)
      .slice(0, 3);
    if (enrolledClasses.length > 2) {
      enrolledClasses[2] += "...";
    }

    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomColorIndex];

    card.style.backgroundColor = randomColor;

    card.innerHTML = `
      <h4><b>${studentInfo.user.fullName}</b></h4>

      <p><b>Enrolled classes:</b></p>
      ${
        studentInfo.classes.length > 0
          ? enrolledClasses.map((className) => `<p>${className}</p>`).join("")
          : "No classes"
      }`;

    card.onclick = (event) => {
      event.stopPropagation();
      window.location.href = `/pages/mainPages/detailedStudents.html?studentId=${studentInfo.id}`;
    };

    studentsGrid.appendChild(card);
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
  document.title = `${student.user.fullName} - EduNet`;

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
    <thead>
      <tr>
          <th></th>
          <th>Name</th>
          <th>Contact No.</th>
          <th class="hideable">Email</th>
          <th>Parent's Contact No.</th>
          <th class="hideable">Parent's Email</th>
          <th></th>
      </tr>
    </thead>`;
  const body = document.createElement("tbody");
  studentsTable.appendChild(body);

  if (students.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <tr>
              <td colspan="7">No students found</td>
          </tr>`;
    body.appendChild(row);
  }
  students.map((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <tr>
          <td>${index + 1}</td>
          <td><a href="/pages/mainPages/detailedStudents.html?studentId=${
            student.id
          }" class="button-link">${student.user.fullName}</a></td>
          <td>${student.contact}</td>
          <td class="hideable">${student.user.email}</td>
          <td>${student.parent.contact}</td>
          <td class="hideable">${student.parent.user.email}</td>
          <td><button id="remove-student-${
            student.id
          }"><i class="fa fa-close"></i></button></td>
      </tr>`;
    body.appendChild(row);
    const removeStudentButton = document.getElementById(
      `remove-student-${student.id}`
    );
    removeStudentButton.onclick = (event) => {
      event.stopPropagation();
      addConfirmModal("remove a student", "remove-student", () =>
        handleDelete(student.id)
      );
    };
  });
}
