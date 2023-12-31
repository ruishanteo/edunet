importScripts("/js/common/api.js");

self.addEventListener("message", (e) => {
  const args = e.data;

  switch (args.updateType) {
    case "create":
      return createHomework(args);
    case "edit":
      return editHomework(args);
    case "delete":
      return deleteHomework(args);
    default:
      return getHomework(args);
  }
});

async function reloadHomework(args) {
  args.updateType = "";
  getHomework(args);
}

async function getHomework(args) {
  try {
    const requestURL = args.studentId
      ? `${args.baseUrl}/announcement/student/${args.studentId}`
      : `${args.baseUrl}/announcement/class/${args.classId}`;

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

async function createHomework(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/announcement`, {
        method: "POST",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: args.classId,
          ...args.updateBody,
        }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then((res) => {
      reloadHomework(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editHomework(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/announcement`, {
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
      reloadHomework(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteHomework(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/announcement`, {
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
      reloadHomework(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
