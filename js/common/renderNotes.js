function renderNotes(notes, args, handleDelete, handleView) {
  const notesGrid = document.getElementById("notes-grid");
  const colors = [
    "#DAC4F7",
    "#D6F6DD",
    "#F4989C",
    "#ACECF7",
    "#DEE7E7",
    "#D0A5C0",
    "#F0B7B3",
  ];

  if (!notesGrid) {
    return;
  }

  notesGrid.innerHTML = notes.length === 0 ? "No notes created" : "";

  notes.forEach((noteInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomColorIndex];

    card.style.backgroundColor = randomColor;

    card.innerHTML = `
      <div class="subclass">
        <h4><b>${noteInfo.title}</b></h4>
        ${
          args.isAdmin || (args.isTutor && args.user.id === noteInfo.creatorId)
            ? `<button class="icon-button" id="action-note-${noteInfo.id}">
                <i class="fa fa-trash"></i>
            </button>`
            : ""
        }
      </div><br />
        
      <p>${noteInfo.content}</p>`;

    notesGrid.appendChild(card);

    card.onclick = (event) => {
      event.stopPropagation();
      handleView(noteInfo);
    };

    const deleteNoteButton = document.getElementById(
      `action-note-${noteInfo.id}`
    );
    if (deleteNoteButton) {
      deleteNoteButton.onclick = (event) => {
        event.stopPropagation();
        handleDelete(noteInfo.id);
      };
    }
  });
}
