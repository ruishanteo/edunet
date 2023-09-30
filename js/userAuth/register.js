document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  const handleLogin = async (event) => {
    event.preventDefault();

    const centreName = document.getElementById("centre-name").value;
    const fullName = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const contact = document.getElementById("contact").value;

    const data = {
      centreName: centreName,
      fullName: fullName,
      email: email,
      password: password,
      contact: contact,
    };

    if (password != confirmPassword) {
      return showStatus("Passwords do not match", "error");
    }

    try {
      const response = await fetch(
        "http://localhost:8000/public/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (result.message === "User registered successfully") {
        showStatus("Successfully registered. Welcome", "success");
        localStorage.setItem("accessToken", result.tokens.accessToken);
        localStorage.setItem("user", JSON.stringify(result.user));

        window.location.href = getHomePage(result.user);
      } else {
        showStatus("Registration failed: " + result.message, "error");
      }
    } catch (error) {
      showStatus("Registration failed: " + error, "error");
    }
  };

  registerForm.addEventListener("submit", handleLogin);
});
