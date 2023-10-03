importScripts("/js/common/api.js");

self.addEventListener("message", (e) => {
  const args = e.data;

  switch (args.updateType) {
    case "create":
      return createAssessment(args);
    case "edit":
      return editAssessment(args);
    case "delete":
      return deleteAssessment(args);
    default:
      return getAssessments(args);
  }
});

async function reloadAssessments(args) {
  args.updateType = "";
  getAssessments(args);
}

async function getAssessments(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/assessment/${args.studentId}`, {
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

async function createAssessment(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/assessment`, {
        method: "POST",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: args.classId,
          studentId: args.studentId,
          ...args.updateBody,
        }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then((res) => {
      reloadAssessments(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editAssessment(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/assessment`, {
        method: "PUT",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classId: args.classId,
          studentId: args.studentId,
          ...args.updateBody,
        }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then((res) => {
      reloadAssessments(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteAssessment(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/assessment`, {
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
      reloadAssessments(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
