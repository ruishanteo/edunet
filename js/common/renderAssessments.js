async function makeAccordionSection(
  classInfo,
  assessments,
  handleEditAssessment,
  handleDeleteAssessment,
  handleAddAssessment
) {
  const accordionSections = document.getElementById("accordion-sections");

  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = `class-${classInfo.id}`;
  input.classList.add("accordion_input");

  const label = document.createElement("label");
  label.htmlFor = `class-${classInfo.id}`;
  label.classList.add("accordion_label");
  label.innerHTML = `
    <span class="accordion_label--text">${classInfo.name}</span>
    <i class="fa fa-chevron-down"></i>`;

  const div = document.createElement("div");
  div.classList.add("accordion_content");
  const button = document.createElement("button");
  button.id = `add-assessment-${classInfo.id}`;
  button.textContent = "+ Assessment";

  button.addEventListener("click", (e) => {
    e.preventDefault();
    handleAddAssessment(classInfo.id);
  });

  // const addAssessmentHandler = document.createElement("script");
  // addAssessmentHandler.src = "/js/modals/addAssessmentModal.js";
  // addAssessmentHandler.setAttribute("classId", classInfo.id);
  // addAssessmentHandler.setAttribute("studentId", studentId);
  // button.appendChild(addAssessmentHandler);

  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th>Assessment</th>
      <th>Total</th>
      <th>Score</th>
      <th></th>
      <th></th>
    </tr>`;

  if (assessments.length === 0) {
    table.innerHTML += `
        <tr>
          <td colspan="7">No assessments found</td>
        <tr>`;
  }

  assessments.forEach((assessment) => {
    table.innerHTML += `
      <tr>
        <td>${assessment.name}</td>
        <td>${assessment.total}</td>
        <td>${assessment.score}</td>
        <td><button id="edit-assessment-${assessment.id}"><i class="fa fa-close"></i></button></td>
        <td><button id="delete-assessment-${assessment.id}"><i class="fa fa-close"></i></button></td>
      </tr>`;
  });

  div.appendChild(button);
  div.appendChild(table);
  accordionSections.appendChild(input);
  accordionSections.appendChild(label);
  accordionSections.appendChild(div);

  assessments.forEach((assessment) => {
    const editAssessmentButton = document.getElementById(
      `edit-assessment-${assessment.id}`
    );
    const deleteAssessmentButton = document.getElementById(
      `delete-assessment-${assessment.id}`
    );
    deleteAssessmentButton.addEventListener("click", (e) => {
      e.preventDefault();
      handleDeleteAssessment(assessment);
    });
  });
}

function renderAssessments(
  assessments,
  classes,
  args,
  handleEdit,
  handleDelete,
  handleAddAssessment
) {
  const accordionSections = document.getElementById("accordion-sections");
  if (!classes || !accordionSections) {
    return;
  }

  accordionSections.innerHTML = "";
  classes.map((classInfo, index) =>
    makeAccordionSection(
      classInfo,
      assessments.filter((assessment) => assessment.classId === classInfo.id),
      handleEdit,
      handleDelete,
      handleAddAssessment
    )
  );
}
