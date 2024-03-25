import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'src/artists/entities/artist.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(TracksService) private readonly tracksService: TracksService,
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}
  static albums: Album[] = [];

  async create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new HttpException(
        'Name and year are required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const album = this.albumRepository.create(createAlbumDto);
    album.artist = { id: createAlbumDto.artistId } as Artist;
    const createdAlbum = await this.albumRepository.save(album);
    return {
      id: createdAlbum.id,
      name: createdAlbum.name,
      year: createdAlbum.year,
      artistId: createdAlbum.artist.id,
    };
  }

  findAll() {
    return this.albumRepository.find();
  }

  async findOne(id: string) {
    const album = await this.albumRepository.findOne({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(`album with ID ${id} not found`);
    }
    return {
      id: album.id,
      name: album.name,
      year: album.year,
    };
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    if (
      updateAlbumDto.name !== undefined &&
      typeof updateAlbumDto.name !== 'string'
    ) {
      throw new HttpException('Name must be a string', HttpStatus.BAD_REQUEST);
    }
    if (
      updateAlbumDto.year !== undefined &&
      typeof updateAlbumDto.year !== 'number'
    ) {
      throw new HttpException('Year must be a number', HttpStatus.BAD_REQUEST);
    }
    if (
      updateAlbumDto.artistId !== undefined &&
      typeof updateAlbumDto.artistId !== 'string'
    ) {
      throw new HttpException(
        'Artist ID must be a string',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateAlbumDto.name !== undefined) {
      album.name = updateAlbumDto.name;
    }
    if (updateAlbumDto.year !== undefined) {
      album.year = updateAlbumDto.year;
    }
    if (updateAlbumDto.artistId !== undefined) {
      const artist = await this.artistRepository.findOne({
        where: { id: updateAlbumDto.artistId },
      });
      if (!artist) {
        throw new NotFoundException(
          `Artist with ID ${updateAlbumDto.artistId} not found`,
        );
      }
      album.artist = artist;
    }

    await this.albumRepository.save(album);
    return album;
  }

  remove(id: string) {
    const album = this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    this.albumRepository.delete(id);
  }

  // updateArtistId(artistId: string, value: string | null): void {
  //   // const album = AlbumsService.albums
  //   //   .find
  //   //   // (album) => album.artistId == artistId,
  //   //   ();
  //   if (album) {
  //     // album.artistId = value;
  //   }
  // }
}
