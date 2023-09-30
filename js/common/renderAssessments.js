const openedSections = {};
async function makeAccordionSection(
  args,
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
  input.checked = openedSections[classInfo.id];
  input.classList.add("accordion_input");

  input.onclick = () => {
    if (openedSections[classInfo.id]) {
      openedSections[classInfo.id] = false;
    } else {
      openedSections[classInfo.id] = true;
    }
  };

  const label = document.createElement("label");
  label.htmlFor = `class-${classInfo.id}`;
  label.classList.add("accordion_label");
  label.innerHTML = `
    <span class="accordion_label--text">${classInfo.name}</span>
    <i class="fa fa-chevron-down"></i>`;

  const div = document.createElement("div");
  div.classList.add("accordion_content");

  if (args.user.type !== "student") {
    const button = document.createElement("button");
    button.id = `add-assessment-${classInfo.id}`;
    button.textContent = "+ Assessment";

    button.onclick = (e) => {
      e.preventDefault();
      handleAddAssessment(classInfo.id);
    };
    div.appendChild(button);
  }

  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th>Assessment</th>
      <th>Score</th>
      <th>Total</th>
      ${
        assessments.length === 0
          ? ""
          : `<th class="smallest-column"></th>
      <th class="smallest-column"></th>`
      }
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
        <td>${assessment.score}</td>
        <td>${assessment.total}</td>
        <td class="smallest-column"><button id="edit-assessment-${assessment.id}"><i class="fa fa-pencil"></i></button></td>
        <td class="smallest-column"><button id="delete-assessment-${assessment.id}"><i class="fa fa-close"></i></button></td>
      </tr>`;
  });

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

    deleteAssessmentButton.onclick = (e) => {
      e.preventDefault();
      handleDeleteAssessment(assessment);
    };

    editAssessmentButton.onclick = (e) => {
      e.preventDefault();
      handleEditAssessment(assessment);
    };
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
      args,
      classInfo,
      assessments.filter((assessment) => assessment.classId === classInfo.id),
      handleEdit,
      handleDelete,
      handleAddAssessment
    )
  );
}
