self.addEventListener("message", (e) => getAuth(e.data));

async function getAuth(args) {
  if (!args.accessToken || !args.user) {
    return self.postMessage({ authenticated: false });
  }

  try {
    const response = await fetch(`${args.baseUrl}/auth/${args.user.id}`, {
      method: "GET",
      headers: {
        Authorization: `${args.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return self.postMessage({ authenticated: false });
    }

    response.json().then((res) => {
      return self.postMessage({ authenticated: true, user: res.user });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
