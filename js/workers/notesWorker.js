importScripts("/js/common/api.js");

self.addEventListener("message", (e) => {
  const args = e.data;

  switch (args.updateType) {
    case "create":
      return createNote(args);
    case "edit":
      return editNote(args);
    case "delete":
      return deleteNote(args);
    default:
      return getNotes(args);
  }
});

async function reloadNotes(args) {
  args.updateType = "";
  getNotes(args);
}

async function getNotes(args) {
  try {
    const requestURL = args.studentId
      ? `${args.baseUrl}/note/student/${args.studentId}`
      : args.tutorId
      ? `${args.baseUrl}/note/tutor/${args.tutorId}`
      : `${args.baseUrl}/note`;

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

    response.json().then((res) => self.postMessage(res));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function createNote(args) {
  try {
    const requestURL = args.studentId
      ? `${args.baseUrl}/note/student`
      : args.tutorId
      ? `${args.baseUrl}/note/tutor`
      : `${args.baseUrl}/note`;

    const response = await handleApiCall(
      fetch(requestURL, {
        method: "POST",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId: args.tutorId,
          studentId: args.studentId,
          ...args.updateBody,
        }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then((res) => {
      reloadNotes(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editNote(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/note`, {
        method: "PUT",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args.updateBody),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then((res) => {
      reloadNotes(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteNote(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/note`, {
        method: "DELETE",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args.updateBody),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then((res) => {
      reloadNotes(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
