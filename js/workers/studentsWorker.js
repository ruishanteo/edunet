importScripts("/js/common/api.js");

self.addEventListener("message", (e) => {
  const args = e.data;
  switch (args.updateType) {
    case "create":
      return createStudent(args);
    case "get":
      return getStudent(args);
    case "edit":
      return editStudent(args);
    case "delete":
      return deleteStudent(args);
    case "assign":
      return enrollStudent(args);
    case "unroll":
      return removeStudent(args);
    default:
      return getStudents(args);
  }
});

async function reloadStudents(args) {
  args.updateType = "";
  getStudents(args);
}

async function reloadStudent(args) {
  args.updateType = "get";
  getStudent(args);
}

async function getStudents(args) {
  try {
    const requestURL = args.tutorId
      ? `${args.baseUrl}/student/tutor/${args.tutorId}`
      : `${args.baseUrl}/student`;
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

async function getStudent(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/student/${args.studentId}`, {
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

async function createStudent(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/student`, {
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

    response.json().then(() => reloadStudents(args));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editStudent(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/student`, {
        method: "PUT",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: args.studentId, ...args.updateBody }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then(() => reloadStudent(args));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteStudent(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/student`, {
        method: "DELETE",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: args.studentId, ...args.updateBody }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then(() => {
      reloadStudents(args);
      self.postMessage({ isDeleted: args.isSelf });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function enrollStudent(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/student/enroll`, {
        method: "PUT",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: args.studentId, ...args.updateBody }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then(() => reloadStudents(args));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function removeStudent(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/student/unroll`, {
        method: "PUT",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: args.studentId, ...args.updateBody }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then(() => reloadStudents(args));
  } catch (error) {
    console.error("Error:", error);
  }
}
