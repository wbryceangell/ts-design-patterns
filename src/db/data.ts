import { IArticle } from "./article";
import { IUser } from "./user";

export class Data implements IDataPrototype {
  constructor(public users: IUser[], public articles: IArticle[]) {
    if (!users || !articles) throw new Error("Missing data");
  }

  clone(): Data {
    const cloned = Object.create(Data.prototype || null);
    Object.getOwnPropertyNames(this).map((key: string) => {
      cloned[key] = this[key as keyof typeof this];
    });
    return cloned;
  }
}

interface IDataPrototype extends IData {
  clone(): IDataPrototype;
}

export interface IData {
  users: IUser[];
  articles: IArticle[];
}
