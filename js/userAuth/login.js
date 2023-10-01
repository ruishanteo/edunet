document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const args = getArgs();

    args.updateType = "login";
    args.updateBody = {
      email: email,
      password: password,
    };
    authWorker.postMessage(args);
  };

  loginForm.addEventListener("submit", handleLogin);
});
