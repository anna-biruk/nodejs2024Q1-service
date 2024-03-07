import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    return `This action returns all artists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} artist`;
  }

  update(id: number, updateArtistDto: UpdateArtistDto) {
    return `This action updates a #${id} artist`;
  }

  remove(id: number) {
    return `This action removes a #${id} artist`;
  }
}
