import { v4 as uuid } from 'uuid';
interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
export class Artist implements IArtist {
  constructor(id: string, name: string, grammy: boolean) {
    this.id = id;
    this.name = name;
    this.grammy = grammy;
  }
  id: string = uuid();
  name: string;
  grammy: boolean;
}
