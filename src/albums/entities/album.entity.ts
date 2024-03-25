import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
interface IAlbum {
  id: string;
  name: string;
  year: number;
  artist: Artist; // refers to Artist
}
@Entity()
export class Album implements IAlbum {
  constructor(name: string, year: number) {
    this.name = name;
    this.year = year;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  name: string;
  @Column()
  year: number;
  @ManyToOne(() => Artist, (artist) => artist.albums, { onDelete: 'SET NULL' })
  artist: Artist;

  @OneToMany(() => Track, (t) => t.album, { onDelete: 'SET NULL' })
  tracks: Track[];
  // @ManyToMany(() => Favorite, (favorite) => favorite.tracks)
  // favorites: Favorite[];
}
