export interface CRUD<T> {
  create: (object: Exclude<T, "uuid">) => Promise<void>;
  read: () => Promise<T[]>;
  update: (uuid: string, object: Partial<Exclude<T, "uuid">>) => Promise<void>;
  delete: (uuid: string) => Promise<void>;
}
