async function getAuth() {
  const accessToken = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");

  if (!accessToken || !user) {
    localStorage.clear();
    // window.location.href = "/pages/userAuth/login.html";
    return;
  }

  const userData = JSON.parse(user);
  const userId = userData.id;

  try {
    const response = await fetch(
      `https://edunet.onrender.com/api/auth/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      localStorage.clear();
      //   window.location.href = "/pages/userAuth/login.html";
      return;
    }

    response.json().then((res) => {
      window.user = res.user;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

await getAuth();
