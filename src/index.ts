import http, { IncomingMessage } from "http";
import { ArticlesCrud } from "./crud/articles";
import { CrudFactory, CrudType } from "./crud/factory";
import { UsersCrud } from "./crud/users";

const server = http.createServer(async (req, res) => {
  const crudType = req.url?.split("/")[1] as CrudType;
  const uuid = req.url?.split("/")[2] as string;

  let crud: UsersCrud | ArticlesCrud;
  try {
    crud = CrudFactory.getInstance().get(crudType);
  } catch (e) {
    console.warn(e);
    res.statusCode = 404;
    return res.end();
  }

  if (req.method === "GET") {
    const data = await crud.read();
    res.end(JSON.stringify(data));
  }

  if (req.method === "POST") {
    const json = await getJsonBody(req);
    await crud.create(json);
    res.statusCode = 201;
    res.end();
  }

  if (req.method === "PATCH") {
    const json = await getJsonBody(req);
    await crud.update(uuid, json);
    res.statusCode = 204;
    res.end();
  }

  if (req.method === "DELETE") {
    await crud.delete(uuid);
    res.statusCode = 204;
    res.end();
  }
});

async function getJsonBody(req: IncomingMessage) {
  return new Promise<any>((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const json = JSON.parse(body);
        resolve(json);
      } catch (e) {
        console.warn(e);
        reject(new Error("Failed to get JSON from request body"));
      }
    });
  });
}

server.listen(8080);
