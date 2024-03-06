import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  private albums: Album[] = [];

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
    this.albums.push(album);
    return album;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    return this.albums.find((album) => album.id === id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return `This action updates a #${id} album`;
  }

  remove(id: string) {
    return `This action removes a #${id} album`;
  }
}
