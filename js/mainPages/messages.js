const messagesWorker = new Worker("/js/workers/messagesWorker.js");
let users = null;

const reloadChats = () => {
  const args = getArgs();
  args.updateType = "get";
  messagesWorker.postMessage(args);
};

const sendMesage = (params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  messagesWorker.postMessage(args);
};

{
  const handleSendMessage = () =>
    addModal(
      "Send Message",
      "send-message-form",
      `<div class="section">
        <label>To</label> <input type="text" placeholder="Start searching..." id="form-name" />
        <div id="name-dropdown" class="dropdown-content"></div><br />
        <label>Message</label><textarea type="text" id="form-message" rows="15" maxlength="1500" required></textarea> <br />
        <button type="submit"><i class="fa fa-paper-plane"></i> Send</button>
    </div>`,
      () =>
        filterDropDown(
          document.getElementById("form-name"),
          document.getElementById("name-dropdown"),
          users
        ),
      (close) => {
        const content = document.getElementById("form-message").value;
        const options = document.getElementsByName("receiver-name");

        const receiverId = Array.from(options, (option) => ({
          id: parseInt(option.value),
          checked: option.checked,
        }))
          .filter((option) => option.checked)
          .map((option) => option.id)
          .pop();

        if (receiverId) {
          sendMesage({ receiverId: receiverId, content: content });
          close();
        } else {
          showStatus("Please select a to", "error");
        }
      }
    );
  messagesWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.chats) {
      renderChats(args, e.data.chats, handleSendMessage);
    }
  });
}

function fetchUsers() {
  fetch(`${args.baseUrl}/auth`, {
    method: "GET",
    headers: {
      Authorization: `${args.accessToken}`,
      "Content-Type": "application/json",
    },
  }).then((ret) =>
    ret.json().then((res) => {
      users = res.users;
    })
  );
}

addCallback(() => {
  reloadChats();
  fetchUsers();
});
