function renderClasses(classes, args, handleDelete, handleAddClass) {
  const classesGrid = document.getElementById("classes-grid");
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

    card.innerHTML = `
        <h4><b>${classInfo.name}</b></h4>

        <p>${classInfo.day} ${classInfo.time}</p>
        <p>${classInfo.venue}</p>
        <p>${classInfo.students.length} students enrolled</p>`;

    classesGrid.appendChild(card);

    if (args.isAdmin) {
      card.onclick = (event) => {
        event.stopPropagation();
        window.location.href = `/pages/admin/detailedClasses.html?classId=${classInfo.id}`;
      };
    }
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

function renderClass(classInfo, handleDelete) {
  const className = document.getElementById("class-name");
  className.textContent = classInfo.name;

  const tutorNameRead = document.getElementById("tutor-name-read");
  if (classInfo.tutors.length === 0) {
    tutorNameRead.textContent = "No tutor assigned yet";
  } else {
    const tutor = classInfo.tutors[0];
    tutorNameRead.innerHTML = `<a href="/pages/mainPages/detailedTutors.html?tutorId=${tutor.id}">${tutor.user.fullName}</a>`;
  }

  const deleteClassButton = document.getElementById("delete-class-button");
  deleteClassButton.onclick = (event) => {
    event.preventDefault();
    handleDelete(classInfo.id);
  };
}
