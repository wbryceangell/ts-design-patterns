import { Database } from "../db/database";
import { IUser, UserBuilder } from "../db/user";
import { CRUD } from "./crud";

export class UsersCrud implements CRUD<IUser> {
  private static instance: UsersCrud;

  private constructor() {}

  static getInstance() {
    if (!UsersCrud.instance) {
      UsersCrud.instance = new UsersCrud();
    }
    return UsersCrud.instance;
  }

  async create(object: IUser) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    data.users.push(new UserBuilder(object).build());
    await write(data);
  }

  async read() {
    return (await Database.getInstance().read()).users;
  }

  async update(uuid: string, object: IUser) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    const index = data.users.findIndex((user) => user.uuid === uuid);
    if (index === -1) throw new Error("Failed to find user");
    const user = new UserBuilder(data.users[index])
      .setName(object.name || (data.users[index].name as string))
      .build();
    data.users[index] = user;
    await write(data);
  }

  async delete(uuid: string) {
    const [read, write] = await Database.getInstance().transaction();
    const data = await read();
    data.users = data.users.filter((user) => user.uuid !== uuid);
    await write(data);
  }
}
