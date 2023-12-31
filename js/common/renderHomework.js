function renderHomeworkRows(
  homework,
  canEdit,
  onDelete,
  onEdit,
  onUpload,
  onDownload
) {
  const homeworkTable = document.getElementById("homework-table");
  homeworkTable.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th>Homework Name</th>
        <th class="hideable">Description</th>
        <th>Due Date</th>
        ${
          canEdit
            ? `<th class="smallest-column hideable"></th>
                <th class="smallest-column hideable"></th>
                <th class="smallest-column"></th>
                <th class="smallest-column"></th>`
            : ""
        }
      </tr>
    </thead>`;
  const body = document.createElement("tbody");
  homeworkTable.appendChild(body);

  if (homework.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <tr>
              <td colspan="7">No homework found</td>
          </tr>`;
    body.appendChild(row);
  }
  homework.map((homework, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <tr>
          <td>${index + 1}</td>
          <td>${homework.title}</td>
          <td class="hideable">${homework.description}</td>
          <td>${moment(homework.dueDate.slice(0, 16)).format(
            "MMMM Do YYYY, hh:mm a"
          )}</td>
          ${
            canEdit
              ? `
              <td class="hideable"><button id="upload-grade-${homework.id}"><i class="fa-solid fa-arrow-up-from-bracket"></i></button></td>
              <td class="hideable"><button id="download-grade-${homework.id}"><i class="fa-solid fa-arrow-down"></i></button></td>
              <td><button id="edit-homework-${homework.id}"><i class="fa fa-pencil"></i></button></td>
              <td><button id="delete-homework-${homework.id}"><i class="fa fa-close"></i></button></td>`
              : ""
          }
      </tr>`;
    body.appendChild(row);

    const deleteHomework = document.getElementById(
      `delete-homework-${homework.id}`
    );
    if (deleteHomework) {
      deleteHomework.onclick = (event) => {
        event.stopPropagation();
        addConfirmModal("delete homework", "delete-homework", () =>
          onDelete(homework.id)
        );
      };
    }

    const editHomework = document.getElementById(
      `edit-homework-${homework.id}`
    );
    if (editHomework) {
      editHomework.onclick = (event) => {
        event.stopPropagation();
        addModal(
          "Edit Homework",
          "edit-homework-form",
          `<div class="section">
                <h3 class="content-title">Title</h3> <input value="${
                  homework.title
                }" type="text" id="form-title" maxlength="100" required/><br />
                <h3 class="content-title">Description</h3> <textarea type="text" id="form-description" rows="20" maxlength="1000" required>${
                  homework.description
                }</textarea> <br />
                <h3 class="content-title">Due Date</h3> <input value="${homework.dueDate.slice(
                  0,
                  16
                )}" type="datetime-local" id="form-due-date" required/><br />
                <button type="submit">Update</button>
              </div>`,
          null,
          (close) => {
            const title = document.getElementById("form-title").value;
            const content = document.getElementById("form-description").value;
            const dueDate = document.getElementById("form-due-date").value;

            if (
              title === homework.title &&
              content === homework.description &&
              dueDate === homework.dueDate.slice(0, 16)
            ) {
              close();
              return;
            }

            onEdit(homework.id, title, content, dueDate);
            close();
          }
        );
      };
    }

    const uploadGrade = document.getElementById(`upload-grade-${homework.id}`);
    if (uploadGrade) {
      uploadGrade.onclick = (event) => {
        event.stopPropagation();
        addModal(
          "Upload Grade",
          "upload-grade-form",
          `<div class="section">
                <label>Total Score</label> <input type="number" id="form-grade" min="0" max="100" required/><br />
                <label>File</label> <input type="file" id="form-file" required/><br />
                <button type="submit">Upload</button>
              </div>`,
          null,
          (close) => {
            const grade = document.getElementById("form-grade").value;
            const file = document.getElementById("form-file").files[0];

            onUpload(homework, grade, file);
            close();
          }
        );
      };
    }

    const downloadGrade = document.getElementById(
      `download-grade-${homework.id}`
    );
    if (downloadGrade) {
      downloadGrade.onclick = (event) => {
        event.stopPropagation();
        onDownload(homework.title);
      };
    }
  });
}
