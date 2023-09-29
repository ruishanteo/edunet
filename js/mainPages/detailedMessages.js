const urlParams = new URLSearchParams(window.location.search);
const receiverId = parseInt(urlParams.get("receiverId"));

const messagesWorker = new Worker("/js/workers/messagesWorker.js");

const reloadMessages = () => {
  const args = getArgs();
  args.receiverId = receiverId;
  messagesWorker.postMessage(args);
};

const sendMesage = (params) => {
  const args = getArgs();
  args.updateType = "create";
  args.updateBody = params;
  args.receiverId = receiverId;
  messagesWorker.postMessage(args);
};

{
  const handleSendMessage = () => null;

  messagesWorker.addEventListener("message", function (e) {
    handleNotifications(e);

    if (e.data.messages) {
      renderMessages(args, e.data.messages, e.data.receiver, handleSendMessage);
    }
  });

  const form = document.getElementById("send-message-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const messageInput = document.getElementById("message-content");
    const content = messageInput.value;
    messageInput.value = "";

    sendMesage({ content });
  });
}

addCallback(reloadMessages);
