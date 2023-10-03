importScripts("/js/common/api.js");

self.addEventListener("message", (e) => {
  const args = e.data;
  switch (args.updateType) {
    case "create":
      return createMessage(args);
    case "get":
      return getChats(args);
    default:
      return getMessages(args);
  }
});

async function reloadMessages(args) {
  args.updateType = "";
  getMessages(args);
}

async function getMessages(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/message/${args.receiverId}`, {
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

async function getChats(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/message`, {
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

async function createMessage(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/message`, {
        method: "POST",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: args.receiverId,
          ...args.updateBody,
        }),
      })
    );

    if (!response.ok) {
      return;
    }

    response.json().then(() => {
      if (args.receiverId) {
        reloadMessages(args);
      } else {
        getChats(args);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
