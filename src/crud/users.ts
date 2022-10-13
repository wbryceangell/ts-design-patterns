import { Database } from "../db/database";
import { User, UserBuilder } from "../db/user";
import { CRUD } from "./crud";

export class UsersCrud implements CRUD<User> {
  private static instance: UsersCrud;

  private constructor() {}

  static getInstance() {
    if (!UsersCrud.instance) {
      UsersCrud.instance = new UsersCrud();
    }
    return UsersCrud.instance;
  }

  async create(object: Exclude<User, "uuid">) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    data.users.push(new UserBuilder(object).build());
    await write(data);
  }

  async read() {
    return (await Database.getInstance().read()).users;
  }

  async update(uuid: string, object: Partial<Exclude<User, "uuid">>) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    let user = data.users.find((user) => user.uuid === uuid) as User;
    user = new UserBuilder(user).setName(object.name || "").build();
    await write(data);
  }

  async delete(uuid: string) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    data.users = data.users.filter((user) => user.uuid !== uuid);
    await write(data);
  }
}
