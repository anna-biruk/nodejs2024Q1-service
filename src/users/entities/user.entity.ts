import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

interface IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
@Entity()
export class User implements IUser {
  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
    const timestamp = new Date().getMilliseconds();
    this.createdAt = timestamp;
    this.updatedAt = timestamp;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  login: string;
  @Column()
  password: string;
  @Column()
  version: number = 1;
  @Column()
  createdAt: number;
  @Column()
  updatedAt: number;
}
