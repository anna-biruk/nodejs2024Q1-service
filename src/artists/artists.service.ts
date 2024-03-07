import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuid } from 'uuid';
import { AlbumsService } from 'src/albums/albums.service';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(AlbumsService) private readonly albumsService: AlbumsService,
    @Inject(TracksService) private readonly tracksService: TracksService,
  ) {}
  static artists: Artist[] = [];
  create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || typeof createArtistDto.grammy !== 'boolean') {
      throw new HttpException(
        'Name and grammy are required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const id = createArtistDto.id || uuid();
    const artist = new Artist(id, createArtistDto.name, createArtistDto.grammy);
    ArtistsService.artists.push(artist);
    console.log;
    return artist;
  }

  findAll() {
    return ArtistsService.artists;
  }

  findOne(id: string) {
    return ArtistsService.artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = ArtistsService.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }

    if (updateArtistDto.name && typeof updateArtistDto.name !== 'string') {
      throw new HttpException('Name must be a string', HttpStatus.BAD_REQUEST);
    }
    if (
      updateArtistDto.grammy !== undefined &&
      typeof updateArtistDto.grammy !== 'boolean'
    ) {
      throw new HttpException('Year must be a boolean', HttpStatus.BAD_REQUEST);
    }

    if (updateArtistDto.name) {
      artist.name = updateArtistDto.name;
    }
    if (updateArtistDto.grammy !== undefined) {
      artist.grammy = updateArtistDto.grammy;
    }

    return artist;
  }

  remove(id: string) {
    const artistIndex = ArtistsService.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    ArtistsService.artists.splice(artistIndex, 1);

    this.albumsService.updateArtistId(id, null);
    this.tracksService.updateArtistId(id, null);
  }
}
