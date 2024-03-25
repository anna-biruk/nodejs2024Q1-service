import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { TracksService } from 'src/tracks/tracks.service';
import { Album } from './entities/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { Favorite } from 'src/favorites/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Artist, Track, Favorite])],
  controllers: [AlbumsController],
  providers: [AlbumsService, TracksService],
})
export class AlbumsModule {}
