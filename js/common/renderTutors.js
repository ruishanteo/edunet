function renderTutors(tutors, args, handleDelete) {
  const tutorsGrid = document.getElementById("tutors-grid");
  if (!tutorsGrid) {
    return;
  }

  tutorsGrid.innerHTML = tutors.length === 0 ? "No tutors found" : "";

  tutors.forEach((tutorInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const enrolledClasses = tutorInfo.classes
      .map((classInfo) => `${classInfo.name}`)
      .slice(0, 3);
    if (enrolledClasses.length > 2) {
      enrolledClasses[2] += "...";
    }
    card.innerHTML = `
    <h4><b>${tutorInfo.user.fullName}</b></h4>

    <p><b>Enrolled classes:</b></p>
    ${
      tutorInfo.classes.length > 0
        ? enrolledClasses.map((className) => `<p>${className}</p>`).join("")
        : "No classes"
    }`;

    if (args.isAdmin) {
      card.onclick = (event) => {
        event.stopPropagation();
        window.location.href = `/pages/mainPages/detailedTutors.html?tutorId=${tutorInfo.id}`;
      };
    }

    tutorsGrid.appendChild(card);

    const deleteClassButton = document.getElementById(
      `action-tutor-${tutorInfo.id}`
    );
    if (!deleteClassButton) {
      return;
    }

    deleteClassButton.onclick = (event) => {
      event.stopPropagation();
      handleDelete(tutorInfo.id);
    };
  });
}

function renderTutor(tutor, args, handleEdit, handleDelete) {
  const tutorFullName = document.getElementById("tutor-full-name");
  tutorFullName.textContent = tutor.user.fullName;
  const tutorContact = document.getElementById("tutor-contact");
  tutorContact.textContent = tutor.contact;
  const tutorEmail = document.getElementById("tutor-email");
  tutorEmail.textContent = tutor.user.email;

  const deleteTutorButton = document.getElementById("delete-tutor-button");
  const editTutorButton = document.getElementById("edit-tutor-button");

  if (!args.isAdmin) {
    if (deleteTutorButton) deleteTutorButton.remove();
    if (editTutorButton) editTutorButton.remove();
    return;
  }

  if (editTutorButton && handleEdit) {
    editTutorButton.onclick = (event) => {
      event.preventDefault();
      handleEdit();
    };
  }

  if (deleteTutorButton && handleDelete) {
    deleteTutorButton.onclick = (event) => {
      event.preventDefault();
      handleDelete();
    };
  }
}
