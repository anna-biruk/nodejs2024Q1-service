import { v4 as uuid } from 'uuid';
interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
export class Artist implements IArtist {
  id: string = uuid(); // uuid v4
  name: string;
  grammy: boolean;
}
