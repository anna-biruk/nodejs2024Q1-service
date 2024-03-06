import { v4 as uuid } from 'uuid';
interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
export class Album implements IAlbum {
  constructor(name: string, year: number, artistId: string | null) {
    this.name = name;
    this.year = year;
    this.artistId = artistId;
  }
  id: string = uuid(); // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
