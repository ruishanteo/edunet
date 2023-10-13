const announcementsWorker = new Worker("/js/workers/announcementsWorker.js");

const reloadAnnouncements = () => {
  const args = getArgs();
  args.updateType = "";
  args.studentId = args.user.studentId;
  announcementsWorker.postMessage(args);
};

announcementsWorker.addEventListener("message", function (e) {
  handleNotifications(e);

  if (e.data.announcements) {
    renderAnnouncements(
      e.data.announcements,
      args.isAdmin || args.isTutor,
      (id) => deleteAnnouncement({ announcementId: id }),
      (id, title, content) =>
        editAnnouncement({
          announcementId: id,
          title,
          content,
        })
    );
  }
});

addCallback(() => {
  reloadAnnouncements();
});
