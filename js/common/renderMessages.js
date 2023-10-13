function filterDropDown(filterInput, dropdownList, items) {
  if (!items) {
    return;
  }

  items.forEach((item) => {
    const option = document.createElement("div");
    option.classList.add("class-checkbox-row");
    option.id = item;
    option.innerHTML = `
        <p class="class-checkbox-text">${item.fullName} (${
      item.type.charAt(0).toUpperCase() + item.type.slice(1)
    })</p>
        <input value="${item.id}" type="radio" name="receiver-name" id="${
      item.fullName
    }" class="class-checkbox"/>`;
    dropdownList.appendChild(option);
  });

  const options = document.getElementsByName("receiver-name");

  filterInput.addEventListener("input", function () {
    const filterValue = this.value.toLowerCase();
    Array.from(options, (option) => option).forEach((option) => {
      const optionValue = option.id.toLowerCase();
      const div = option.parentElement;
      div.style.display = optionValue.includes(filterValue) ? "flex" : "none";
    });
  });
}

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

  setTimeout(() => {
    messagesList.scrollTop = messagesList.scrollHeight;
  }, 1000);
}

function renderChats(args, chats, handleAddMessage) {
  const chatsList = document.getElementById("chats-grid");
  const colors = [
    "#DAC4F7",
    "#D6F6DD",
    "#F4989C",
    "#ACECF7",
    "#DEE7E7",
    "#D0A5C0",
    "#F0B7B3",
  ];

  if (!chatsList) {
    return;
  }

  chatsList.innerHTML = chats.length === 0 ? "No chat history" : "";

  chats.forEach((chatInfo) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomColorIndex];

    card.style.backgroundColor = randomColor;

    card.innerHTML = `
      <div class="subclass">
        <div class="message-body">
          <h4><b>${chatInfo.otherParty.fullName} (${
      chatInfo.otherParty.type.charAt(0).toUpperCase() +
      chatInfo.otherParty.type.slice(1)
    })</b></h4>
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

  const addMessageButton = document.getElementById("add-message-button");
  addMessageButton.onclick = (e) => {
    e.preventDefault();
    handleAddMessage();
  };
}
