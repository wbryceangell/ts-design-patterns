import { v4 } from "uuid";

export class UserBuilder implements IUserBuilder {
  private user: IUser;

  constructor(user?: IUser, private _v4 = v4, private _Date = Date) {
    this.user = user || {};
  }

  setName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  build(): User {
    const user = new User(
      this.user.uuid || this._v4(),
      this.user.created || new this._Date().toISOString(),
      this.user.name
    );
    this.clear();
    return user;
  }

  clear() {
    this.user = {};
  }
}

interface IUserBuilder {
  setName(name: string): UserBuilder;
  build(): User;
}

class User implements IUserPrototype {
  constructor(
    public uuid?: string,
    public created?: string,
    public name?: string
  ) {
    if (!uuid || !created || !name) throw new Error("Invalid user");
  }

  clone(): User {
    const cloned = Object.create(User.prototype || null);
    Object.getOwnPropertyNames(this).map((key: string) => {
      cloned[key] = this[key as keyof typeof this];
    });
    return cloned;
  }
}

interface IUserPrototype extends IUser {
  clone(): IUserPrototype;
}

export interface IUser {
  uuid?: string;
  created?: string;
  name?: string;
}
