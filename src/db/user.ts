import { v4 } from "uuid";

export class User {
  constructor(
    public uuid?: string,
    public created?: string,
    public name?: string
  ) {}
}

export interface UserBuilder {
  setName(name: string): UserBuilder;
  build(): User;
}

export class UserBuilder implements UserBuilder {
  constructor(private user: User, private _v4 = v4, private _Date = Date) {
    if (!this.user.uuid) this.user.uuid = this._v4();
  }

  setName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  build(): User {
    if (!this.user.created) this.user.created = new this._Date().toISOString();
    const user = this.user;
    this.clear();
    return user;
  }

  clear() {
    this.user = new User(this._v4());
  }
}
