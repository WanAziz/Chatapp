const express = require("express");
const session = require("express-session");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const mysql = require("mysql");
const { error } = require("console");
const { resolve } = require("path");
const { rejects } = require("assert");
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

async function loginUsers(user, pass) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users WHERE username = "${user}" AND password = "${pass}"`,
      function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function registedUsers(user, pass) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (id_user, username, password) VALUES (NULL, '${user}', '${pass}')`,
      function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function friendUsers(user) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM chat WHERE user1 = "${user}" OR user2 = "${user}"`,
      function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function getTable(table) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM ${table} ORDER BY tanggal DESC`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function getUsers(user, friend) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM users WHERE username = "${friend}" AND username != "${user}"`,
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function createTable(user1, user2) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO chat (user1, user2, table_chat) VALUES (?, ?, ?)`,
      [user1, user2, user1 + user2],
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

// Fungsi async untuk menyisipkan pesan ke dalam tabel chat
async function insertChat(user, msg, tableChat) {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO ${tableChat} (user, text, tanggal) VALUES (?, ?, current_timestamp())`,
      [user, msg],
      function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

// Fungsi async untuk mendapatkan data chat terbaru dari tabel chat
async function getLatestChats(tableChat) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM ${tableChat} ORDER BY tanggal DESC`,
      function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

io.on("connection", (socket) => {
  socket.on("login", async (user, pass, back) => {
    try {
      const result = await loginUsers(user, pass);
      back(result);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("registed", async (user, pass, back) => {
    try {
      const result = await registedUsers(user, pass);
      back(result);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("friend", async (user, back) => {
    try {
      const result = await friendUsers(user);
      back(result);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("findFriend", async (user, friend, back) => {
    try {
      const result = await getUsers(user, friend);
      
      if (result.length) {
        await createTable(user , friend)
        back(true)
        return
      }

      back(false)
    } catch (err) {
      console.error(error);
    }
  });

  socket.on("rooms", async (user, tableBefore, tableChat, back) => {
    socket.leave(tableBefore);

    socket.join(tableChat);

    try {
      const result = await getTable(tableChat);
      back(result);
    } catch (error) {
      console.error(error.code);
    }
  });

  socket.on("sendChat", async (user, msg, tableChat, back) => {
    try {
      await insertChat(user, msg, tableChat);

      const latestChats = await getLatestChats(tableChat);
      back(latestChats);
      socket.to(tableChat).emit("reciveChat", latestChats);
    } catch (error) {
      console.error(error);
    }
  });
});

server.listen(5174, () => {
  console.log("listening on *:5174");
});
