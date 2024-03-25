import { v4 as uuid } from 'uuid';

interface IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export class User implements IUser {
  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
    const timestamp = new Date().getMilliseconds();
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }
  id: string = uuid();
  login: string;
  password: string;
  version: number = 1;
  createdAt: number;
  updatedAt: number;
}
