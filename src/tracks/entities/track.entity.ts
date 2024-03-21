import { Album } from 'src/albums/entities/album.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

interface ITrack {
  id: string; // uuid v4
  name: string;
  album: Album; // refers to Album
  duration: number; // integer number
}
@Entity()
export class Track implements ITrack {
  constructor(name: string, duration: number) {
    this.name = name;
    this.duration = duration;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  name: string;

  @ManyToOne(() => Album, (album) => album.tracks)
  album: Album;

  @Column()
  duration: number; // integer number
}
