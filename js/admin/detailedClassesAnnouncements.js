let announcements = [];

async function getAnnouncements(studentId, classId) {
  try {
    const requestURL = studentId
      ? `${args.baseUrl}/announcement/student/${studentId}`
      : `${args.baseUrl}/announcement/class/${classId}`;

    const response = await handleApiCall(
      fetch(requestURL, {
        method: "GET",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then((res) => {
      announcements = res.announcements;
      renderAnnouncements(announcements, getArgs().isAdmin);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
