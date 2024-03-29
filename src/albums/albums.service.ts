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

@Injectable()
export class AlbumsService {
  constructor(
    @Inject(TracksService) private readonly tracksService: TracksService,
  ) {}
  static albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new HttpException(
        'Name and year are required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const album = new Album(
      createAlbumDto.name,
      createAlbumDto.year,
      createAlbumDto.artistId,
    );
    AlbumsService.albums.push(album);
    return album;
  }

  findAll() {
    return AlbumsService.albums;
  }

  findOne(id: string) {
    return AlbumsService.albums.find((album) => album.id === id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = AlbumsService.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    if (updateAlbumDto.name && typeof updateAlbumDto.name !== 'string') {
      throw new HttpException('Name must be a string', HttpStatus.BAD_REQUEST);
    }
    if (updateAlbumDto.year && typeof updateAlbumDto.year !== 'number') {
      throw new HttpException('Year must be a number', HttpStatus.BAD_REQUEST);
    }
    if (
      updateAlbumDto.artistId &&
      typeof updateAlbumDto.artistId !== 'string'
    ) {
      throw new HttpException(
        'Artist ID must be a string',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateAlbumDto.name) {
      album.name = updateAlbumDto.name;
    }
    if (updateAlbumDto.year) {
      album.year = updateAlbumDto.year;
    }
    if (updateAlbumDto.artistId) {
      album.artistId = updateAlbumDto.artistId;
    }
    return album;
  }

  remove(id: string) {
    const albumIndex = AlbumsService.albums.findIndex(
      (album) => album.id === id,
    );
    if (albumIndex === -1) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    AlbumsService.albums.splice(albumIndex, 1);
    this.tracksService.updateAlbumId(id, null);
  }

  updateArtistId(artistId: string, value: string | null): void {
    const album = AlbumsService.albums.find(
      (album) => album.artistId == artistId,
    );
    if (album) {
      album.artistId = value;
    }
  }
}
