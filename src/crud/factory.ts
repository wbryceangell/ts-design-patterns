import { ArticlesCrud } from "./articles";
import { UsersCrud } from "./users";

export type CrudType = "users" | "articles";
export class CrudFactory {
  private static instance: CrudFactory;

  private constructor() {}

  static getInstance() {
    if (!CrudFactory.instance) {
      CrudFactory.instance = new CrudFactory();
    }
    return CrudFactory.instance;
  }

  get(crudType: CrudType) {
    switch (crudType) {
      case "users":
        return UsersCrud.getInstance();
      case "articles":
        return ArticlesCrud.getInstance();
      default:
        throw new Error("Failed to get CRUD implementation");
    }
  }
}
