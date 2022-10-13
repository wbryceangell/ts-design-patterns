import { v4 } from "uuid";
import { Article, Database } from "../db/database";
import { CRUD } from "./crud";

export class ArticlesCrud implements CRUD<Article> {
  private static instance: ArticlesCrud;

  private constructor() {}

  static getInstance() {
    if (!ArticlesCrud.instance) {
      ArticlesCrud.instance = new ArticlesCrud();
    }
    return ArticlesCrud.instance;
  }

  async create(object: Exclude<Article, "uuid">) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    const article: Article = {
      uuid: v4(),
      created: new Date().toISOString(),
      author: object.author || "",
      text: object.text || "",
    };
    data.articles.push(article);
    await write(data);
  }

  async read() {
    return (await Database.getInstance().read()).articles;
  }

  async update(uuid: string, object: Partial<Exclude<Article, "uuid">>) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    const article = data.articles.find((article) => article.uuid === uuid);
    if (article) {
      if (object.author) article.author = object.author;
      if (object.text) article.text = object.text;
    }
    await write(data);
  }

  async delete(uuid: string) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    data.articles = data.articles.filter((article) => article.uuid !== uuid);
    await write(data);
  }
}
