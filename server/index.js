const express = require("express");
const session = require("express-session");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const mysql = require("mysql");
const io = new Server(server, { cors: { origin: "*" } });

app.use(
  session({
    secret: "rahasiakamu", // Ganti dengan rahasia yang lebih aman
    resave: false,
    saveUninitialized: false,
  })
);

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_chatapp",
});

async function checkTableExists(table) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ${table}`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function createTable(user1, user2) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO chat (user1, user2, table_chat) VALUES (?, ?, ?)`,
      [user1, user2, user1+user2],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          db.query(
            `CREATE TABLE ${user1}${user2} (user VARCHAR(12) NOT NULL, text TEXT NOT NULL, tanggal DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        }
      }
    );
  });
}

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

  socket.on("registed", (user, pass, back) => {
    db.query(
      `INSERT INTO users (id_user, username, password) VALUES (NULL, '${user}', '${pass}')`,
      function (err, result, fields) {
        back(result);
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

  socket.on("findFriend", (user, friend, back) => {
    db.query(
      `SELECT * FROM users WHERE username = "${friend}" AND username != "${user}"`,
      function (err, result, fields) {
        back(result);
      }
    );
  });

  socket.on("rooms", async (user, tableBefore, tableChat, back) => {
    socket.leave(tableBefore);

    socket.join(tableChat);

    // db.query(
    //   `SELECT * FROM ${tableChat} ORDER BY tanggal DESC`,
    //   function (err, result, fields) {
    //     if (result != null) {
    //       console.log(result)
    //       back(result);
    //     } else {
    //       db.query(
    //         `INSERT INTO chat (user1, user2, table_chat) VALUES ('${user}', '${tableChat}', '${user}${tableChat}')`,
    //         function (err, result, fields) {
    //           db.query(
    //             `CREATE TABLE ${user}${tableChat} (user VARCHAR(12) NOT NULL ,
    //           text TEXT NOT NULL ,
    //            tanggal DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    //            )`,
    //             function (err, result, fields) {
    //               console.log(tableChat + " done");
    //             }
    //           );
    //         }
    //       );
    //     }
    //   }
    // );
    let result
    try {
      result = await checkTableExists(tableChat);
      back(result);
    } catch (error) {
      console.error(error.code);
      await createTable(user , tableChat)
      result = await checkTableExists(user+tableChat)
      back(result)
    }
  });

  socket.on("sendChat", (user, msg, tableChat, back) => {
    db.query(
      `INSERT INTO ${tableChat} (user, text, tanggal) VALUES ('${user}', '${msg}', current_timestamp())`,
      function (err, result, fields) {
        db.query(
          `SELECT * FROM ${tableChat} ORDER BY tanggal DESC`,
          function (err, result, fields) {
            back(result);
            socket.to(tableChat).emit("reciveChat", result);
          }
        );
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
