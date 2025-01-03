const express = require("express");
const cors = require("cors"); //Just for security
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', false); // or true, depending on your preference

// const url ='mongodb://0.0.0.0:27017';

// url = "mongodb+srv://sujalnigam2003:@L0fGdIL3BbyGcUSx.mongodb.net/chatdum?retryWrites=true&w=majority";

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(port, () =>
  console.log(`Server started on `)
);
const io = socket(server, {
  cors: {
    // origin: "http://localhost:3000",
    // origin: "https://frolicking-halva-484bbc.netlify.app/",
    origin: "*",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
