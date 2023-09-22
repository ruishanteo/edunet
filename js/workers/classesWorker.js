self.addEventListener("message", (e) => {
  const args = e.data;
  switch (args.updateType) {
    case "create":
      return createClass(args);
    default:
      return getClasses(args);
  }
});

async function reloadClasses(args) {
  args.updateType = "";
  getClasses(args);
}

async function getClasses(args) {
  try {
    const requestURL = args.studentId
      ? `${args.baseUrl}/class/student/${args.studentId}`
      : args.tutorId
      ? `${args.baseUrl}/class/tutor/${args.tutorId}`
      : `${args.baseUrl}/class`;

    console.log(args.studentId, args.tutorId, requestURL);
    const response = await fetch(requestURL, {
      method: "GET",
      headers: {
        Authorization: `${args.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return;
    }

    response.json().then((res) => self.postMessage(res));
  } catch (error) {
    console.error("Error:", error);
  }
}

async function createClass(args) {
  try {
    const response = await fetch(`${args.baseUrl}/class/`, {
      method: "POST",
      headers: {
        Authorization: `${args.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args.updateBody),
    });

    if (!response.ok) {
      return;
    }

    response.json().then(() => reloadClasses(args));
  } catch (error) {
    console.error("Error:", error);
  }
}
