import http from "http";
import { v4 } from "uuid";
import { Article, Database, User } from "./db";

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith("/users")) {
    if (req.method === "GET") {
      const data = await Database.getInstance().read();
      res.end(JSON.stringify(data.users));
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const json = JSON.parse(body);
        const [read, write] = await Database.getInstance().transaction();
        const data = await read();
        const user: User = {
          uuid: v4(),
          created: new Date().toISOString(),
          name: json.name || "",
        };
        data.users.push(user);
        await write(data);
        res.statusCode = 201;
        res.end();
      });
    }

    if (req.method === "PATCH") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const json = JSON.parse(body);
        const [read, write] = await Database.getInstance().transaction();
        const data = await read();
        const uuid = req.url?.split("/")[2];
        const user = data.users.find((user) => user.uuid === uuid);
        if (user && json.name) user.name = json.name;
        await write(data);
        res.statusCode = 204;
        res.end();
      });
    }

    if (req.method === "DELETE") {
      const [read, write] = await Database.getInstance().transaction();
      const data = await read();
      const uuid = req.url?.split("/")[2];
      data.users = data.users.filter((user) => user.uuid !== uuid);
      await write(data);
      res.statusCode = 204;
      res.end();
    }
  } else if (req.url?.startsWith("/articles")) {
    if (req.method === "GET") {
      const data = await Database.getInstance().read();
      res.end(JSON.stringify(data.articles));
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const json = JSON.parse(body);
        const [read, write] = await Database.getInstance().transaction();
        const data = await read();
        const article: Article = {
          uuid: v4(),
          created: new Date().toISOString(),
          author: json.author || "",
          text: json.text || "",
        };
        data.articles.push(article);
        await write(data);
        res.statusCode = 201;
        res.end();
      });
    }

    if (req.method === "PATCH") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const json = JSON.parse(body);
        const [read, write] = await Database.getInstance().transaction();
        const data = await read();
        const uuid = req.url?.split("/")[2];
        const article = data.articles.find((article) => article.uuid === uuid);
        if (article) {
          if (json.author) article.author = json.author;
          if (json.text) article.text = json.text;
        }
        await write(data);
        res.statusCode = 204;
        res.end();
      });
    }

    if (req.method === "DELETE") {
      const [read, write] = await Database.getInstance().transaction();
      const data = await read();
      const uuid = req.url?.split("/")[2];
      data.articles = data.articles.filter((article) => article.uuid !== uuid);
      await write(data);
      res.statusCode = 204;
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(8080);
