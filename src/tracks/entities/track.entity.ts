import { Album } from 'src/albums/entities/album.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

interface ITrack {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
@Entity()
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
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  name: string;
  @Column()
  artistId: string | null;
  @Column()
  albumId: string | null; // refers to Album

  @Column()
  duration: number; // integer number
}
