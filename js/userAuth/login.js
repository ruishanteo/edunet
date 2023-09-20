document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const type = document.getElementById("types").value;

    const data = {
      email: email,
      password: password,
      type: type,
    };

    try {
      const response = await fetch("http://localhost:8000/public/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.message === "User logged in successfully") {
        localStorage.setItem("accessToken", result.tokens.accessToken);
        localStorage.setItem("user", JSON.stringify(result.user));

        window.location.href = "/pages/admin/home.html";
      } else {
        console.error("Login failed:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  loginForm.addEventListener("submit", handleLogin);
});
