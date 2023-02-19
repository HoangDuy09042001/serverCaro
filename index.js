"use strict";
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
//New start
const http = require("http");
const { Server } = require("socket.io");
//New end
const config = require("./config");
const studentRoutes = require("./routes/student-routes");
const userRoutes = require("./routes/user-routes");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", studentRoutes.routes);
app.use("/api", userRoutes.routes);

const server = http.createServer(app);

let rooms = new Array();
for (var i = 0; i < 1000; i++) {
  if (!rooms[i])
    rooms[i] = {
      number: 0,
      player1: {
        idNode: "",
        id: "",
        imgUrl: "",
      },
      player2: {
        idNode: "",
        id: "",
        imgUrl: "",
      },
    };
}
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", (data) => {
    if (rooms[data.room].number < 2) {
      socket.join(data.room);
      if (rooms[data.room].number === 0 || rooms[data.room].number === 1) {
        if (rooms[data.room].number === 0) {
          rooms[data.room].player1.idNode = data.idNode;
          rooms[data.room].player1.id = data.id;
          rooms[data.room].player1.imgUrl = data.imgUrl;
        } else if (rooms[data.room].number === 1) {
          rooms[data.room].player2.idNode = data.idNode;
          rooms[data.room].player2.id = data.id;
          rooms[data.room].player2.imgUrl = data.imgUrl;
          console.log("room hihi", rooms[data.room]);
        }
        rooms[data.room].number = rooms[data.room].number + 1;
      }
      console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
    }
  });

  socket.on("send_data", (data) => {
    socket.to(data.room).emit("receive_data", data);
  });

  socket.on("send_win", (data) => { 
    socket.emit("receive_win", data);
    socket.to(data.room).emit("receive_win", data);
  });
  
  socket.on("send_one_person_room", (data) => {
    if(data==='single') {
      let arraySingle = []
      for(var i = 0;i<1000; i++) {
        if(rooms[i].number===1) {
          console.log(i)
          arraySingle = [...arraySingle, i]
        }
      }
      console.log(arraySingle)
      socket.emit("recieve_one_person_room", arraySingle);
    }
  });

  socket.on("send_room", (data) => {
    const members = {
      number: rooms[data.room].number,
      ...data,
    };
    socket.emit("receive_room", members);
    socket.to(data.room).emit("receive_room", members);
    if (members.number === 2) {
      const beginInfors = {
        begin: true,
        firstStep: rooms[data.room].player1.id,
        firstStepNode: rooms[data.room].player1.idNode,
        firstStepImgUrl: rooms[data.room].player1.imgUrl,
        secondStep: rooms[data.room].player2.id,
        secondStepNode: rooms[data.room].player2.idNode,
        secondStepImgUrl: rooms[data.room].player2.imgUrl,
        ...members,
      };
      socket.emit("start_room", beginInfors);
      socket.to(data.room).emit("start_room", beginInfors);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(config.port, () =>
  console.log("App is listening on url http://localhost:" + config.port)
);
