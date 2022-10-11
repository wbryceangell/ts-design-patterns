import { readFile, writeFile } from "fs/promises";
import http from "http";
import path from "path";
import { v4 } from "uuid";

let io = Promise.resolve();
const dbPath = path.join(__dirname, "../db.json");

const server = http.createServer((req, res) => {
  if (req.url?.startsWith("/users")) {
    if (req.method === "GET") {
      io = io
        .then(() => {
          return readFile(dbPath);
        })
        .then((buffer) => {
          const db = JSON.parse(buffer.toString());
          res.end(JSON.stringify(db.users));
        });
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const json = JSON.parse(body);
        io = io
          .then(() => {
            return readFile(dbPath);
          })
          .then((buffer) => {
            const db: { users: any[] } = JSON.parse(buffer.toString());
            const user = {
              uuid: v4(),
              created: new Date().toISOString(),
              name: json.name || "",
            };
            db.users.push(user);
            return writeFile(dbPath, JSON.stringify(db));
          })
          .then(() => {
            res.statusCode = 201;
            res.end();
          });
      });
    }

    if (req.method === "PATCH") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const json = JSON.parse(body);
        io = io
          .then(() => {
            return readFile(dbPath);
          })
          .then((buffer) => {
            const db: { users: any[] } = JSON.parse(buffer.toString());
            const uuid = req.url?.split("/")[2];
            const user = db.users.find((user) => user.uuid === uuid);
            if (user && json.name) user.name = json.name;
            return writeFile(dbPath, JSON.stringify(db));
          })
          .then(() => {
            res.statusCode = 204;
            res.end();
          });
      });
    }

    if (req.method === "DELETE") {
      io = io
        .then(() => {
          return readFile(dbPath);
        })
        .then((buffer) => {
          const db: { users: any[] } = JSON.parse(buffer.toString());
          const uuid = req.url?.split("/")[2];
          db.users = db.users.filter((user) => user.uuid !== uuid);
          return writeFile(dbPath, JSON.stringify(db));
        })
        .then(() => {
          res.statusCode = 204;
          res.end();
        });
    }
  } else if (req.url?.startsWith("/articles")) {
    if (req.method === "GET") {
      io = io
        .then(() => {
          return readFile(dbPath);
        })
        .then((buffer) => {
          const db = JSON.parse(buffer.toString());
          res.end(JSON.stringify(db.articles));
        });
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const json = JSON.parse(body);
        io = io
          .then(() => {
            return readFile(dbPath);
          })
          .then((buffer) => {
            const db: { articles: any[] } = JSON.parse(buffer.toString());
            const article = {
              uuid: v4(),
              created: new Date().toISOString(),
              author: json.author || "",
              text: json.text || "",
            };
            db.articles.push(article);
            return writeFile(dbPath, JSON.stringify(db));
          })
          .then(() => {
            res.statusCode = 201;
            res.end();
          });
      });
    }

    if (req.method === "PATCH") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        const json = JSON.parse(body);
        io = io
          .then(() => {
            return readFile(dbPath);
          })
          .then((buffer) => {
            const db: { articles: any[] } = JSON.parse(buffer.toString());
            const uuid = req.url?.split("/")[2];
            const article = db.articles.find(
              (article) => article.uuid === uuid
            );
            if (article) {
              if (json.author) article.author = json.author;
              if (json.text) article.text = json.text;
            }
            return writeFile(dbPath, JSON.stringify(db));
          })
          .then(() => {
            res.statusCode = 204;
            res.end();
          });
      });
    }

    if (req.method === "DELETE") {
      io = io
        .then(() => {
          return readFile(dbPath);
        })
        .then((buffer) => {
          const db: { articles: any[] } = JSON.parse(buffer.toString());
          const uuid = req.url?.split("/")[2];
          db.articles = db.articles.filter((article) => article.uuid !== uuid);
          return writeFile(dbPath, JSON.stringify(db));
        })
        .then(() => {
          res.statusCode = 204;
          res.end();
        });
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(8080);
