function renderParent(args) {
  document.title = `${args.user.fullName} - EduNet`;

  const parentFullName = document.getElementById("parent-full-name");
  parentFullName.textContent = args.user.fullName;
}
