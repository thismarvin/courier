const socket = io('http://192.168.0.14:3030');

const landing = document.getElementById("landing");
const messager = document.getElementById("messager");
const loginForm = document.getElementById("loginForm");
const inputForm = document.getElementById("inputForm");
const messages = document.getElementById("messages");
const feed = document.getElementById("feed");

let username = "User";

messager.style.display = "none";

loginForm.addEventListener("submit", (event) => {
    username = loginForm.username.value;
    loginForm.reset();
    event.preventDefault();

    messager.style.display = "grid";
    landing.style.display = "none";
});

inputForm.addEventListener("submit", (event) => {
    const message = inputForm.message.value;

    socket.emit("send message", {
        "username": username,
        "message": message
    });

    inputForm.reset();

    event.preventDefault();
});

function createEntry(entry) {
    const div = document.createElement("div");
    const h4 = document.createElement("h4");
    const span = document.createElement("span");

    div.appendChild(h4);
    div.appendChild(span);
    messages.appendChild(div);

    div.className = "message-entry";
    h4.innerText = entry.username;
    span.innerText = entry.message;
}

socket.on("login", (data) => {
    if (data.length === 0) {
        return;
    }

    for (let entry of data) {
        createEntry(entry);
    }

    feed.scrollTop = feed.scrollHeight;
});

socket.on('new message', (data) => {
    createEntry(data);

    feed.scrollTop = feed.scrollHeight;
});