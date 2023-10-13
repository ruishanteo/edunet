importScripts("/js/common/api.js");

self.addEventListener("message", (e) => {
  const args = e.data;
  switch (args.updateType) {
    case "get":
      return getClass(args);
    case "create":
      return createClass(args);
    case "edit":
      return editClass(args);
    case "delete":
      return deleteClass(args);
    case "assign":
      return assignTutor(args);
    case "enroll":
      return enrollStudent(args);
    case "remove":
      return removeStudent(args);
    default:
      return getClasses(args);
  }
});

async function reloadClasses(args) {
  args.updateType = "";
  getClasses(args);
}

async function reloadClass(args) {
  args.updateType = "get";
  getClass(args);
}

async function getClasses(args) {
  try {
    const requestURL = args.studentId
      ? `${args.baseUrl}/class/student/${args.studentId}`
      : args.tutorId
      ? `${args.baseUrl}/class/tutor/${args.tutorId}`
      : `${args.baseUrl}/class`;

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

async function getClass(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/class/${args.classId}`, {
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

async function createClass(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/class/`, {
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

    response.json().then((res) => {
      reloadClasses(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function deleteClass(args) {
  try {
    const url = args.tutorId
      ? `${args.baseUrl}/tutor/unassign`
      : args.studentId
      ? `${args.baseUrl}/student/remove`
      : `${args.baseUrl}/class/`;
    const reqMethod = args.tutorId || args.studentId ? "PUT" : "DELETE";
    const response = await handleApiCall(
      fetch(url, {
        method: reqMethod,
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
      reloadClasses(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function editClass(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/class`, {
        method: "PUT",
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
      reloadClass(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function assignTutor(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/tutor/assign`, {
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

    response.json().then((res) => {
      if (args.classId) {
        reloadClass(args);
      } else {
        reloadClasses(args);
      }
      self.postMessage(res);
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

    response.json().then((res) => {
      if (args.classId) {
        reloadClass(args);
      } else {
        reloadClasses(args);
      }
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function removeStudent(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/student/remove`, {
        method: "PUT",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classId: args.classId, ...args.updateBody }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then((res) => {
      if (args.classId) {
        reloadClass(args);
      } else {
        reloadClasses(args);
      }
      reloadClasses(args);
      self.postMessage(res);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
