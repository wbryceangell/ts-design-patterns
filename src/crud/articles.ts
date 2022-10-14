import { ArticleBuilder, IArticle } from "../db/article";
import { Database } from "../db/database";
import { CRUD } from "./crud";

export class ArticlesCrud implements CRUD<IArticle> {
  private static instance: ArticlesCrud;

  private constructor() {}

  static getInstance() {
    if (!ArticlesCrud.instance) {
      ArticlesCrud.instance = new ArticlesCrud();
    }
    return ArticlesCrud.instance;
  }

  async create(object: IArticle) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    data.articles.push(new ArticleBuilder(object).build());
    await write(data);
  }

  async read() {
    return (await Database.getInstance().read()).articles;
  }

  async update(uuid: string, object: IArticle) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    const index = data.articles.findIndex((article) => article.uuid === uuid);
    if (index === -1) throw new Error("Failed to find article");
    const article = new ArticleBuilder(data.articles[index])
      .setAuthor(object.author || (data.articles[index].author as string))
      .setText(object.text || (data.articles[index].text as string))
      .build();
    data.articles[index] = article;
    await write(data);
  }

  async delete(uuid: string) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    data.articles = data.articles.filter((article) => article.uuid !== uuid);
    await write(data);
  }
}
