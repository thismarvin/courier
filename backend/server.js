const express = require("express");
const cors = require("cors");

const PORT = 3030;

const app = express();
app.use(cors());
app.use(express.static("../frontend/public"));

const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(PORT);

const entries = [];

app.get('*',function (_, res) {
    res.redirect('/');
});

io.on("connection", (socket) => {
    console.log(`New user connected (id: ${socket.id}).`);

    socket.emit("login", entries);

    socket.on("send message", (data) => {
        const entry = {
            "username": data.username,
            "message": data.message
        };

        switch (entry.message.toLowerCase()) {
            case "":
                return;
            case "!yeet":
                entry.message = "(╯°□°）╯︵ ┻━┻)"
                break;
        }

        entries.push(entry);

        io.sockets.emit("new message", entries[entries.length - 1]);
    });
});


console.log(`Running on http://localhost:${PORT}`);