function renderClasses(classes, args, handleDelete, handleAddClass) {
  const classesGrid = document.getElementById("classes-grid");
  const colors = [
    "#DAC4F7",
    "#D6F6DD",
    "#F4989C",
    "#ACECF7",
    "#DEE7E7",
    "#D0A5C0",
    "#F0B7B3",
  ];

  if (!classesGrid) {
    return;
  }

  classesGrid.innerHTML =
    classes.length === 0
      ? `<div class="notFound">
          <img src="/assets/empty.png" alt="eddy" width="200" height="200" />
          <p> No classes found. </p>
        </div>
        `
      : "";

  classes.forEach((classInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomColorIndex];

    card.style.backgroundColor = randomColor;

    card.innerHTML = `
        <h4><b>${classInfo.name}</b></h4>

        <p>${classInfo.day} ${classInfo.time}</p>
        <p>${classInfo.venue}</p>
        <p>${classInfo.students.length} students enrolled</p>`;

    classesGrid.appendChild(card);

    card.onclick = (event) => {
      event.stopPropagation();
      window.location.href = `/pages/mainPages/detailedClasses.html?classId=${classInfo.id}`;
    };
  });
  const addClassButton = document.getElementById("add-class-button");
  if (!args.isAdmin && addClassButton) {
    addClassButton.remove();
    return;
  }

  if (addClassButton) {
    addClassButton.onclick = (event) => {
      event.preventDefault();
      handleAddClass();
    };
  }
}

function renderClass(classInfo, args, handleDelete) {
  document.title = `${classInfo.name} - EduNet`;

  const className = document.getElementById("class-name");
  className.textContent = classInfo.name;

  const tutorNameRead = document.getElementById("tutor-name-read");
  if (classInfo.tutors.length === 0) {
    tutorNameRead.textContent = "No tutor assigned yet";
  } else {
    const tutor = classInfo.tutors[0];
    tutorNameRead.innerHTML = args.isAdmin
      ? `<a href="/pages/mainPages/detailedTutors.html?tutorId=${tutor.id}">${tutor.user.fullName}</a>`
      : tutor.user.fullName;
  }

  const classDay = document.getElementById("class-day");
  classDay.textContent = classInfo.day;
  const classTime = document.getElementById("class-time");
  classTime.textContent = classInfo.time;
  const classVenue = document.getElementById("class-venue");
  classVenue.textContent = classInfo.venue;
  const classStudentEnrolled = document.getElementById("class-enrolled");
  classStudentEnrolled.textContent = classInfo.students.length;

  const deleteClassButton = document.getElementById("delete-class-button");
  if (deleteClassButton) {
    deleteClassButton.onclick = (event) => {
      event.preventDefault();
      handleDelete(classInfo.id);
    };
  }
}
