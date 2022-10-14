import { v4 } from "uuid";

export class ArticleBuilder implements IArticleBuilder {
  private article: IArticle;

  constructor(article?: IArticle, private _v4 = v4, private _Date = Date) {
    this.article = article || {};
  }

  setAuthor(author: string): IArticleBuilder {
    this.article.author = author;
    return this;
  }

  setText(text: string): IArticleBuilder {
    this.article.text = text;
    return this;
  }

  build(): Article {
    const article = new Article(
      this.article.uuid || this._v4(),
      this.article.created || new this._Date().toISOString(),
      this.article.author,
      this.article.text
    );
    this.clear();
    return article;
  }

  clear() {
    this.article = {};
  }
}

interface IArticleBuilder {
  setAuthor(author: string): IArticleBuilder;
  setText(text: string): IArticleBuilder;
  build(): Article;
}

class Article implements IArticlePrototype {
  constructor(
    public uuid?: string,
    public created?: string,
    public author?: string,
    public text?: string
  ) {
    if (!uuid || !created || !author || !text)
      throw new Error("Invalid article");
  }

  clone(): Article {
    const cloned = Object.create(Article.prototype || null);
    Object.getOwnPropertyNames(this).map((key: string) => {
      cloned[key] = this[key as keyof typeof this];
    });
    return cloned;
  }
}

interface IArticlePrototype extends IArticle {
  clone(): IArticlePrototype;
}

export interface IArticle {
  uuid?: string;
  created?: string;
  author?: string;
  text?: string;
}
