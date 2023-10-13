function renderHomeworkRows(homework, canEdit, onDelete, onEdit) {
  const homeworkTable = document.getElementById("homework-table");
  homeworkTable.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th>Homework Name</th>
        <th>Description</th>
        <th>Due Date</th>
        ${
          canEdit
            ? `<th class="smallest-column"></th>
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
          <td>${moment(homework.dueDate).format("MMMM Do YYYY, h:mm a")}</td>
          ${
            canEdit
              ? `<td><button id="edit-homework-${homework.id}"><i class="fa fa-pencil"></i></button></td>
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
                <label>Title</label> <input value="${homework.title}" type="text" id="form-title" maxlength="100" required/><br />
                <label>Description</label><textarea type="text" id="form-description" rows="20" maxlength="1000" required>${homework.description}</textarea> <br />
                <button type="submit">Update</button>
              </div>`,
          null,
          (close) => {
            const title = document.getElementById("form-title").value;
            const content = document.getElementById("form-description").value;

            if (title === homework.title && content === homework.description) {
              close();
              return;
            }

            onEdit(homework.id, title, content);
            close();
          }
        );
      };
    }
  });
}
