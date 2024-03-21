import { Album } from 'src/albums/entities/album.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
@Entity()
export class Artist implements IArtist {
  constructor(id: string, name: string, grammy: boolean) {
    this.id = id;
    this.name = name;
    this.grammy = grammy;
  }
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();
  @Column()
  name: string;
  @Column()
  grammy: boolean;
  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];
}
