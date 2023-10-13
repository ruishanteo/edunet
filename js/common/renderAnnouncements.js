function renderAnnouncements(announcements, canEdit, onDelete, onEdit) {
  const args = getArgs();

  const announcementsContainer = document.getElementById("announcements-list");

  announcementsContainer.innerHTML = "";
  announcements.map((announcement, index) => {
    const announcementCard = document.createElement("div");
    announcementCard.classList.add("announcement-card");

    const canEditAnnouncement =
      canEdit || args.user.id === announcement.creator.id;

    announcementCard.innerHTML = `
        <div class="announcement-header">
          <h4 class="announcement-title">
              <b>${announcement.title}</b>
          </h4>
          ${
            canEditAnnouncement
              ? `<button class="icon-button" id="delete-announcement-button-${index}">
            <i class="fa fa-trash"></i>
          </button>`
              : ""
          }
        </div>

        <p class="announcement-content">
            ${announcement.content}
        </p>

        <p class="announcement-detail">
            Posted on: <span id="timestamp">${announcement.createdAt}</span>
        </p>
        <p class="announcement-detail">
            <span id="poster">${announcement.creator.fullName}</span>
        </p>`;

    announcementsContainer.appendChild(announcementCard);
    if (index <= announcements.length - 2) {
      const divider = document.createElement("hr");
      divider.classList.add("divider");
      announcementsContainer.appendChild(divider);
    }

    const deleteAnnouncementButton = document.getElementById(
      `delete-announcement-button-${index}`
    );

    if (canEditAnnouncement) {
      deleteAnnouncementButton.onclick = (event) => {
        event.stopPropagation();
        addConfirmModal("delete an announcement", "delete-announcement", () => {
          onDelete(announcement.id);
        });
      };
    }

    announcementCard.onclick = () => {
      addModal(
        canEdit ? "Edit Announcement" : "View Announcement",
        "detailed-announcement-form",
        canEdit
          ? `<div class="section">
              <label>Title</label> <input value="${announcement.title}" type="text" id="form-title" maxlength="100" required/><br />
              <label>Content</label><textarea type="text" id="form-content" rows="20" maxlength="2500" required>${announcement.content}</textarea> <br />
              <button type="submit">Update</button>
            </div>`
          : `<div class="section">
                <p class="content-title">${announcement.title}</p><br />
                <p class="content-text">${announcement.content}</p><br />
                <label>Created by ${announcement.creator.fullName}</label><br />
                <label>Created at ${announcement.createdAt}</label><br />
              </div>`,
        null,
        canEdit
          ? (close) => {
              const title = document.getElementById("form-title").value;
              const content = document.getElementById("form-content").value;

              if (
                title === announcement.title &&
                content === announcement.content
              ) {
                close();
                return;
              }

              onEdit(announcement.id, title, content);
              close();
            }
          : null
      );
    };
  });
}
