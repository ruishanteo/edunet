document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  const handleRegister = async (event) => {
    event.preventDefault();

    const centreName = document.getElementById("centre-name").value;
    const fullName = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const contact = document.getElementById("contact").value;

    if (password != confirmPassword) {
      return showStatus("Passwords do not match", "error");
    }

    const args = getArgs();

    args.updateType = "register";
    args.updateBody = {
      centreName: centreName,
      fullName: fullName,
      email: email,
      password: password,
      contact: contact,
    };
    authWorker.postMessage(args);
  };

  registerForm.addEventListener("submit", handleRegister);
});
