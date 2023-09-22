self.addEventListener("message", (e) => {
  const args = e.data;
  switch (args.updateType) {
    case "create":
      return createTutor(args);
    case "get":
      return getTutor(args);
    default:
      return getTutors(args);
  }
});

async function reloadTutors(args) {
  args.updateType = "";
  getTutors(args);
}

async function getTutors(args) {
  try {
    const response = await fetch(`${args.baseUrl}/tutor/`, {
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

async function getTutor(args) {
  try {
    const response = await fetch(`${args.baseUrl}/tutor/${args.tutorId}`, {
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

async function createTutor(args) {
  try {
    const response = await fetch(`${args.baseUrl}/tutor/`, {
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

    response.json().then(() => reloadTutors(args));
  } catch (error) {
    console.error("Error:", error);
  }
}
