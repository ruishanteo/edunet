function addModal(title, modalId, innerHtml, onCreation, onSubmit, fullSize) {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <form id=${modalId}>
        <div id="modal" class="modal">
            <div class="modal-content ${fullSize ? "modal-content-full" : ""}">
                <button id="${modalId}-close-modal-button" class="close-modal icon-button fa fa-close"></button>
                <h1>${title}</h1>
                ${innerHtml}
            </div>
        </div>
    </form>`;
  document.body.appendChild(modal);

  const closeModalButton = document.getElementById(
    `${modalId}-close-modal-button`
  );
  const closeModal = () => {
    modal.remove();
  };
  closeModalButton.onclick = closeModal;

  const form = document.getElementById(modalId);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(closeModal);
    } else {
      closeModal();
    }
  });

  if (onCreation) onCreation(modal);
}

function addConfirmModal(desc, modalId, onConfirm) {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <div id="modal" class="modal">
        <div class="modal-content">
            <button id="${modalId}-close-modal-button" class="close-modal icon-button fa fa-close"></button>
            <h1>Are you sure?</h1>
            <br />
            <h4>This action is not reversible!</h4>
            <div class="confirm-content">
              <button id="${modalId}-confirm-modal-button" class="confirm-modal-button"><i class="fa fa-check"></i> Confirm</button>
              <button id="${modalId}-cancel-modal-button" class="confirm-modal-button"><i class="fa fa-close"></i> Cancel</button>
            </div>
        </div>
    </div>`;
  document.body.appendChild(modal);

  const closeModal = (e) => {
    e.preventDefault();
    modal.remove();
  };

  const closeModalButton = document.getElementById(
    `${modalId}-close-modal-button`
  );
  const cancelModalButton = document.getElementById(
    `${modalId}-cancel-modal-button`
  );
  closeModalButton.onclick = closeModal;
  cancelModalButton.onclick = closeModal;

  const confirmModalButton = document.getElementById(
    `${modalId}-confirm-modal-button`
  );
  confirmModalButton.onclick = (e) => {
    e.preventDefault();
    onConfirm();
    modal.remove();
  };
}
