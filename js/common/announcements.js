function renderAnnouncements(announcements, canEdit) {
  const args = getArgs();

  const announcementsContainer = document.getElementById("announcements-list");
  announcements.map((announcement, index) => {
    const announcementCard = document.createElement("div");
    announcementCard.classList.add("announcement-card");
    if (announcement.unread) {
      announcementCard.classList.add("announcement-unread");
    }

    announcementCard.innerHTML = `
        <h4 class="announcement-title">
            <b>${announcement.title}</b>
        </h4>

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
    if (index !== announcement.length - 1) {
      const divider = document.createElement("hr");
      divider.classList.add("divider");
      announcementsContainer.appendChild(divider);
    }

    const canEditAnnouncement =
      canEdit || args.user.id === announcement.creator.id;

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

              //   editNote({ noteId: noteInfo.id, title, content });
              close();
            }
          : null
      );
    };
  });
}
