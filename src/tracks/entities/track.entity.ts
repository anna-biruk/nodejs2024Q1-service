import { v4 as uuid } from 'uuid';

interface ITrack {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
export class Track implements ITrack {
  constructor(
    name: string,
    artistId: string | null,
    albumId: string | null,
    duration: number,
  ) {
    this.name = name;
    this.artistId = artistId;
    this.albumId = albumId;
    this.duration = duration;
  }
  id: string = uuid(); // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
