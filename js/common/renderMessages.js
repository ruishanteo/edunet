function filterDropDown(items) {
  const filterInput = document.getElementById("filterInput");
  const dropdownList = document.getElementById("dropdownList");
  const options = document.querySelectorAll(".dropdown-option");

  let selectedOption = null;

  for (let i = 0; i < items.length; i++) {
    let dropdownItem = document.createElement("a");
    dropdownItem.classList.add("dropdown-option");
    dropdownItem.innerHTML = items[i];
    dropdown.appendChild(dropdownItem);
  }

  filterInput.addEventListener("input", function () {
    const filterValue = this.value.toLowerCase();
    options.forEach((option) => {
      const optionValue = option.dataset.value.toLowerCase();
      option.style.display = optionValue.includes(filterValue)
        ? "block"
        : "none";
    });
    dropdownList.style.display = "block";
  });

  options.forEach((option) => {
    option.addEventListener("click", function () {
      if (selectedOption) {
        selectedOption.classList.remove("selected");
      }
      selectedOption = this;
      filterInput.value = this.dataset.value;
      dropdownList.style.display = "none";
      selectedOption.classList.add("selected");
    });
  });

  input.addEventListener("input", function () {
    let dropdown_items = dropdown.querySelectorAll(".dropdown-item");
    if (!dropdown_items) return false;
    for (let i = 0; i < dropdown_items.length; i++) {
      if (
        dropdown_items[i].innerHTML
          .toUpperCase()
          .includes(input.value.toUpperCase())
      )
        dropdown_items[i].style.display = "block";
      else dropdown_items[i].style.display = "none";
    }
  });
}

//call filterDropDown function
filterDropDown(
  document.getElementById("toggle"),
  document.getElementById("dropdown"),
  document.getElementById("input"),
  devices
);

function renderMessages(args, messages, receiver, handleSendMessage) {
  const receiverName = document.getElementById("receiver-name");
  receiverName.textContent = receiver.fullName;

  const messagesList = document.getElementById("messages-list");
  if (!messagesList) {
    return;
  }

  const user = args.user;

  messagesList.innerHTML = messages.length === 0 ? "No chat history" : "";

  messages.forEach((message) => {
    const card = document.createElement("div");
    if (message.senderId == user.id) {
      card.classList.add("container", "sender");
    } else {
      card.classList.add("container", "receiver");
    }

    card.innerHTML = `
      <p>${message.content}</p>
      <span class="time-right">${moment(message.createdAt).fromNow()}</span>`;

    messagesList.appendChild(card);
  });

  messagesList.scrollTo = messagesList.scrollHeight;
}

function renderChats(args, chats, handleAddMessage) {
  const chatsList = document.getElementById("chats-grid");
  if (!chatsList) {
    return;
  }

  chatsList.innerHTML = chats.length === 0 ? "No chat history" : "";

  chats.forEach((chatInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <div class="subclass">
        <div class="message-body">
          <h4><b>${chatInfo.otherParty.fullName}</b></h4>
          <p>${chatInfo.chat.content}</p>
        </div>
        <button class="icon-button" id="view-chat-${chatInfo.chat.id}">
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>`;

    chatsList.appendChild(card);

    card.onclick = (e) => {
      e.preventDefault();
      window.location.href = `/pages/mainPages/detailedMessage.html?receiverId=${chatInfo.otherParty.id}`;
    };
  });
}
