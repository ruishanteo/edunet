function renderClasses(classes, args, reload) {
  const classesGrid = document.getElementById("classes-grid");
  if (!classesGrid) {
    return;
  }

  classesGrid.innerHTML = classes.length === 0 ? "No classes assigned" : "";

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
    if (!deleteClassButton) {
      return;
    }

    deleteClassButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const url = args.tutorId
        ? `${args.baseUrl}/tutor/unassign`
        : args.studentId
        ? `${args.baseUrl}/student/remove`
        : `${args.baseUrl}/class/`;
      const reqMethod = args.tutorId || args.studentId ? "PUT" : "DELETE";
      fetch(url, {
        method: reqMethod,
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: classInfo.id,
          tutorId: args.tutorId,
          studentId: args.studentId,
        }),
      }).then(reload);
    });
  });
}
