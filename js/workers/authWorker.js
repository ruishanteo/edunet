importScripts("/js/common/api.js");

self.addEventListener("message", (e) => {
  const args = e.data;
  switch (args.updateType) {
    case "login":
      return login(args);
    case "register":
      return register(args);
    default:
      return getAuth(args);
  }
});

async function getAuth(args) {
  if (!args.accessToken || !args.user) {
    return self.postMessage({ failedAuthentication: true });
  }

  return self.postMessage({ authenticated: true, user: args.user });

  try {
    const response = await handleApiCall(
      fetch(`${args.baseUrl}/auth/${args.user.id}`, {
        method: "GET",
        headers: {
          Authorization: `${args.accessToken}`,
          "Content-Type": "application/json",
        },
      })
    );

    if (!response.ok) {
      return self.postMessage({ failedAuthentication: true });
    }

    response.json().then((res) => {
      return self.postMessage({ authenticated: true, user: res.user });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function login(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.publicUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args.updateBody),
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

async function register(args) {
  try {
    const response = await handleApiCall(
      fetch(`${args.publicUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args.updateBody),
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
