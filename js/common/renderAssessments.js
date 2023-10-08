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

  if (args.isTutor) {
    const addAssessmentButton = document.createElement("button");
    addAssessmentButton.id = `add-assessment-${classInfo.id}`;
    addAssessmentButton.textContent = "+ Assessment";

    addAssessmentButton.onclick = (e) => {
      e.preventDefault();
      handleAddAssessment(classInfo.id);
    };
    div.appendChild(addAssessmentButton);
  }

  if (assessments.length === 0) {
    const noAssesmentFound = document.createElement("p");
    noAssesmentFound.className = "empty-table-row";
    noAssesmentFound.textContent = "No assessments found";
    div.appendChild(noAssesmentFound);
    accordionSections.appendChild(input);
    accordionSections.appendChild(label);
    accordionSections.appendChild(div);
    return;
  }

  const visualiseAssessmentButton = document.createElement("button");
  visualiseAssessmentButton.innerHTML = `<i class="fa fa-bar-chart"></i>`;
  visualiseAssessmentButton.id = `visualise-assessment-${classInfo.id}`;
  div.appendChild(visualiseAssessmentButton);

  visualiseAssessmentButton.onclick = (e) => {
    e.preventDefault();
    handleViewAssessments(assessments, classInfo);
  };

  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th>Assessment</th>
      <th>Score</th>
      <th>Total</th>
      ${
        assessments.length === 0 || !args.isTutor
          ? ""
          : `<th class="smallest-column"></th><th class="smallest-column"></th>`
      }
    </tr>`;

  assessments.forEach((assessment) => {
    table.innerHTML += `
      <tr>
        <td>${assessment.name}</td>
        <td>${assessment.score}</td>
        <td>${assessment.total}</td>
        ${
          !args.isTutor
            ? ""
            : `
        <td class="smallest-column"><button id="edit-assessment-${assessment.id}" class="responsive-button"><i class="fa fa-pencil"></i></button></td>
        <td class="smallest-column"><button id="delete-assessment-${assessment.id}" class="responsive-button"><i class="fa fa-close"></i></button></td>`
        }
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

    if (deleteAssessmentButton) {
      deleteAssessmentButton.onclick = (e) => {
        e.preventDefault();
        handleDeleteAssessment(assessment);
      };
    }

    if (editAssessmentButton) {
      editAssessmentButton.onclick = (e) => {
        e.preventDefault();
        handleEditAssessment(assessment);
      };
    }
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
