export interface CRUD<T> {
  create: (object: T) => Promise<void>;
  read: () => Promise<T[]>;
  update: (uuid: string, object: T) => Promise<void>;
  delete: (uuid: string) => Promise<void>;
}
