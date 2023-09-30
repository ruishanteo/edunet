function renderNotes(notes, args, handleDelete, handleView) {
  const notesGrid = document.getElementById("notes-grid");
  if (!notesGrid) {
    return;
  }

  if (!args.isAdmin) {
    notesGrid.remove();
    const infoHeader = document.getElementById("note-information-header");
    const infoBox = document.getElementById("note-information-box");
    if (infoHeader) infoHeader.remove();
    if (infoBox) infoBox.remove();
    return;
  }

  notesGrid.innerHTML = notes.length === 0 ? "No notes created" : "";

  notes.forEach((noteInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="subclass">
        <h4><b>${noteInfo.title}</b></h4>
        ${
          args.isAdmin
            ? `<button class="icon-button" id="action-note-${noteInfo.id}">
                <i class="fa fa-trash"></i>
            </button>`
            : ""
        }
      </div>  
        
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
