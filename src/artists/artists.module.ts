import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { Artist } from './entities/artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'src/favorites/entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Favorite])],
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
