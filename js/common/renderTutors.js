function renderTutors(tutors, args, reload) {
  const tutorsGrids = document.getElementById("tutors-grid");
  if (!tutorsGrids) {
    return;
  }

  tutorsGrids.innerHTML = tutors.length === 0 ? "No tutors found" : "";

  tutors.forEach((tutorInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="subclass">
        <h4><b>${tutorInfo.user.fullName}</b></h4>
        ${
          args.canEdit &&
          `<button class="icon-button" id="action-class-${tutorInfo.id}">
              <i class="fa fa-trash"></i>
            </button>`
        }
      </div>

      <p><b>Assigned classes:</b></p>
      ${
        tutorInfo.classes.length > 0
          ? tutorInfo.classes
              .map((classInfo) => `<p>${classInfo.name}</p>`)
              .join("")
          : "No classes"
      }`;

    if (args.isAdmin) {
      card.addEventListener("click", (event) => {
        event.stopPropagation();
        window.location.href = `/pages/admin/detailedTutors.html?tutorId=${tutorInfo.id}`;
      });
    }

    tutorsGrids.appendChild(card);

    const deleteClassButton = document.getElementById(
      `action-class-${tutorInfo.id}`
    );
    if (!deleteClassButton) {
      return;
    }

    deleteClassButton.addEventListener("click", (event) => {
      event.stopPropagation();
      fetch(`${args.baseUrl}/tutor`, {
        method: "DELETE",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId: args.tutorId,
        }),
      }).then(reload);
    });
  });
}

function renderTutor(tutor, args, reload) {
  const tutorFullName = document.getElementById("tutor-full-name");
  tutorFullName.textContent = tutor.user.fullName;
  const tutorContact = document.getElementById("tutor-contact");
  tutorContact.textContent = tutor.contact;
  const tutorEmail = document.getElementById("tutor-email");
  tutorEmail.textContent = tutor.user.email;

  const editTutorButton = document.getElementById(
    `action-tutor-${tutorInfo.id}`
  );
  if (!editTutorButton) {
    return;
  }
}
