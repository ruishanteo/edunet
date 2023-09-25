importScripts("/js/common/api.js");

self.addEventListener("message", (e) => {
  const args = e.data;
  switch (args.updateType) {
    case "create":
      return editTutor(args);
    case "get":
      return getTutor(args);
    case "edit":
      return editTutor(args);
    case "delete":
      return deleteTutor(args);
    default:
      return getTutors(args);
  }
});

async function reloadTutors(args) {
  args.updateType = "";
  getTutors(args);
}

async function reloadTutor(args) {
  args.updateType = "get";
  getTutor(args);
}

async function getTutors(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/tutor`, {
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

async function getTutor(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/tutor/${args.tutorId}`, {
        method: "GET",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
      })
    );

    if (!response.ok) {
      self.postMessage({ failedGet: true });
      return;
    }

    response.json().then((res) => self.postMessage(res));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function createTutor(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/tutor`, {
        method: "POST",
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

    response.json().then(() => reloadTutors(args));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editTutor(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/tutor`, {
        method: "PUT",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tutorId: args.tutorId, ...args.updateBody }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then(() => reloadTutor(args));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteTutor(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/tutor`, {
        method: "DELETE",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tutorId: args.tutorId, ...args.updateBody }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then((res) => {
      reloadTutors(args);
      self.postMessage({ isDeleted: args.isSelf });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
