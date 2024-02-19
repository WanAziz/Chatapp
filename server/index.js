const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const mysql = require("mysql");
const io = new Server(server, { cors: { origin: "*" } });

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_chatapp",
});

io.on("connection", (socket) => {
  socket.on("login", (user, pass, back) => {
    db.query(
      `SELECT * FROM users WHERE username = "${user}" AND password = "${pass}"`,
      function (err, result, fields) {
        if (result[0]) {
          back({
            status: result[0].username,
          });
        } else {
          back({
            status: "null",
          });
        }
      }
    );
  });

  socket.on("friend", (user, back) => {
    db.query(
      `SELECT * FROM chat WHERE user1 = "${user}" OR user2 = "${user}"`,
      function (err, result, fields) {
        back(result);
      }
    );
  });

  socket.on("rooms", (tableBefore, tableChat, back) => {
    socket.leave(tableBefore);

    socket.join(tableChat);

    db.query(`SELECT * FROM ${tableChat} ORDER BY tanggal DESC`, function (err, result, fields) {
      if (result != null) {
        back(result);
      } else {
        db.query(
          `CREATE TABLE ${tableChat} (user VARCHAR(12) NOT NULL , 
          text TEXT NOT NULL ,
           tanggal DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP 
           )`,
          function (err, result, fields) {
            console.log(tableChat + " done");
          }
        );
      }
    });
  });

  socket.on("sendChat", (user, msg, tableChat, back) => {
    db.query(
      `INSERT INTO ${tableChat} (user, text, tanggal) VALUES ('${user}', '${msg}', current_timestamp())`,
      function (err, result, fields) {
        db.query(`SELECT * FROM ${tableChat} ORDER BY tanggal DESC`, function (err, result, fields) {
          back(result);
          socket.to(tableChat).emit("reciveChat", result);
        });
      }
    );
  });

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.leave(data.kamar);
    socket.join(data.kamar);
    console.log(data.lel);
    console.log(socket.rooms);
    socket.to(data.kamar).emit("receive_message", data);
  });
});

server.listen(5174, () => {
  console.log("listening on *:5174");
});
