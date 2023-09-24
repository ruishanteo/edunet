function renderClasses(classes, args, handleDelete) {
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
        <div class="subclass">
        <h4><b>${classInfo.name}</b></h4>
        ${
          args.canEdit &&
          `<button class="icon-button" id="action-class-${classInfo.id}">
                <i class="fa fa-trash"></i>
            </button>`
        }
        </div>

        <p>${classInfo.day} ${classInfo.time}</p>
        <p>${classInfo.venue}</p>
        <p>${classInfo.students.length} students enrolled</p>`;

    if (args.isAdmin) {
      card.addEventListener("click", (event) => {
        event.stopPropagation();
        window.location.href = `/pages/admin/detailedClasses.html?classId=${classInfo.id}`;
      });
    }

    classesGrid.appendChild(card);

    const deleteClassButton = document.getElementById(
      `action-class-${classInfo.id}`
    );
    if (deleteClassButton) {
      deleteClassButton.addEventListener("click", (event) => {
        event.stopPropagation();
        handleDelete(classInfo.id);
      });
    }
  });
}

function renderClass(classInfo, handleDelete) {
  const className = document.getElementById("class-name");
  className.textContent = classInfo.name;

  const tutorNameRead = document.getElementById("tutor-name-read");
  if (classInfo.tutors.length === 0) {
    tutorNameRead.textContent = "No tutor assigned yet";
  } else {
    const tutor = classInfo.tutors[0];
    tutorNameRead.innerHTML = `<a href="/pages/admin/detailedTutors.html?tutorId=${tutor.id}">${tutor.user.fullName}</a>`;
  }

  const deleteClassButton = document.getElementById("delete-class-button");
  deleteClassButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleDelete(classInfo.id);
  });
}
