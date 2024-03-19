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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistsService {
  constructor(
    @Inject(AlbumsService) private readonly albumsService: AlbumsService,
    @Inject(TracksService) private readonly tracksService: TracksService,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  static artists: Artist[] = [];
  async create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || typeof createArtistDto.grammy !== 'boolean') {
      throw new HttpException(
        'Name and grammy are required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const artistDtoWithId = {
      ...createArtistDto,
      id: createArtistDto.id || uuid(),
    };

    const artist = this.artistRepository.create(artistDtoWithId);
    await this.artistRepository.save(artist);
    return artist;
  }

  findAll() {
    return this.artistRepository.find();
  }

  findOne(id: string) {
    return this.artistRepository.findOne({ where: { id } });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
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

    await this.artistRepository.save(artist);
    return artist;
  }

  async remove(id: string) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      throw new HttpException(
        `Artist with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    this.artistRepository.delete(id);
  }
}
