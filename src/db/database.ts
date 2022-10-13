import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { User } from "./user";

export class Database {
  private static instance: Database;
  private operations = Promise.resolve();
  private path: string;

  private constructor(
    private _readFile = readFile,
    private _writeFile = writeFile,
    _join = join
  ) {
    this.path = _join(__dirname, "../../db.json");
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  read() {
    return new Promise<Data>((resolve) => {
      this.operations = this.operations
        .then(() => {
          return this._readFile(this.path);
        })
        .then((buffer) => {
          const data: Data = JSON.parse(buffer.toString());
          resolve(data);
        });
    });
  }

  transaction() {
    return new Promise<[() => Promise<Data>, (data: Data) => Promise<void>]>(
      (resolveTransaction) => {
        const read = new Promise<Data>((resolveRead) => {
          const write = new Promise<Data>((resolveWrite) => {
            const written = new Promise<void>((resolveWritten) => {
              this.operations = this.operations
                .then(() => {
                  return this._readFile(this.path);
                })
                .then((buffer) => {
                  const data: Data = JSON.parse(buffer.toString());
                  resolveRead(data);
                  return write;
                })
                .then((data) => {
                  return this._writeFile(this.path, JSON.stringify(data));
                })
                .then(resolveWritten);
            });
            resolveTransaction([
              () => read,
              (data) => {
                resolveWrite(data);
                return written;
              },
            ]);
          });
        });
      }
    );
  }
}

export type Data = { users: User[]; articles: Article[] };
export type Article = DataObject & { author: string; text: string };
export interface DataObject {
  uuid: string;
  created: string;
}
