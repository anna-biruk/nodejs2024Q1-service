import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];
  create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || typeof createArtistDto.grammy !== 'boolean') {
      throw new HttpException(
        'Name and grammy are required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const id = createArtistDto.id || uuid();
    const artist = new Artist(id, createArtistDto.name, createArtistDto.grammy);
    this.artists.push(artist);
    console.log;
    return artist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    return this.artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.artists.find((artist) => artist.id === id);
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
    return `This action removes a #${id} artist`;
  }
}
