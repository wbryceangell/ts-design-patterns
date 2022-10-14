import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { Data, IData } from "./data";

export class Database {
  private static instance: Database;
  private operations = Promise.resolve();
  private path: string;
  private data!: Data;

  private constructor(
    _readFile = readFile,
    private _writeFile = writeFile,
    _join = join
  ) {
    this.path = _join(__dirname, "../../db.json");
    this.operations = this.operations
      .then(() => {
        return _readFile(this.path);
      })
      .then((buffer) => {
        const data: IData = JSON.parse(buffer.toString());
        this.data = new Data(data.users, data.articles);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  read() {
    return new Promise<Data>((resolve, reject) => {
      this.operations = this.operations
        .then(() => {
          resolve(this.data.clone());
        })
        .catch((reason) => {
          reject(reason);
          throw reason;
        });
    });
  }

  transaction() {
    return new Promise<[() => Promise<Data>, (data: Data) => Promise<void>]>(
      (resolveTransaction) => {
        const read = new Promise<Data>((resolveRead, rejectRead) => {
          const write = new Promise<Data>((resolveWrite, rejectWrite) => {
            const written = new Promise<void>(
              (resolveWritten, rejectWritten) => {
                this.operations = this.operations
                  .then(() => {
                    resolveRead(this.data.clone());
                    return write;
                  })
                  .then((data) => {
                    this.data = data.clone();
                    return this._writeFile(
                      this.path,
                      JSON.stringify(this.data)
                    );
                  })
                  .then(resolveWritten)
                  .catch((reason) => {
                    rejectRead(reason);
                    rejectWrite(reason);
                    rejectWritten(reason);
                    throw reason;
                  });
              }
            );
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
