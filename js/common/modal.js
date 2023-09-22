function addModal(title, modalId, innerHtml, onCreation, onSubmit, onClose) {
  const modal = document.createElement("div");
  modal.innerHTML = `
    <form id=${modalId}>
        <div id="modal" class="modal">
            <div class="modal-content">
                <button id="close-modal" class="close-modal icon-button fa fa-close"></button>
                <h1>${title}</h1>
                ${innerHtml}
            </div>
        </div>
    </form>`;
  document.body.appendChild(modal);

  const closeModalButton = document.getElementById("close-modal");
  const closeModal = () => {
    modal.remove();
    if (onClose) onClose();
  };
  closeModalButton.addEventListener("click", closeModal);

  const form = document.getElementById(modalId);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(modal, closeModal);
    } else {
      closeModal();
    }
  });

  if (onCreation) onCreation(modal);
}
