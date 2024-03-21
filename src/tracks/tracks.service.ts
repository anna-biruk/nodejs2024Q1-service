import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track) private tracksRepository: Repository<Track>,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new HttpException(
        'Name and duration are required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const track = new Track(createTrackDto.name, createTrackDto.duration);
    track.album = { id: createTrackDto.albumId } as Album;

    track.album.artist = { id: createTrackDto.artistId } as Artist;
    await this.tracksRepository.save(track);

    return {
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
    };
  }

  findAll() {
    return this.tracksRepository.find();
  }

  findOne(id: string) {
    return this.tracksRepository.findOne({ where: { id } });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.tracksRepository.findOne({
      where: { id },
      relations: ['album', 'album.artist'],
    });
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    if (updateTrackDto.name !== undefined) {
      if (typeof updateTrackDto.name !== 'string') {
        throw new HttpException(
          'Name must be a string',
          HttpStatus.BAD_REQUEST,
        );
      }
      track.name = updateTrackDto.name;
    }
    if (updateTrackDto.duration !== undefined) {
      if (typeof updateTrackDto.duration !== 'number') {
        throw new HttpException(
          'Duration must be a number',
          HttpStatus.BAD_REQUEST,
        );
      }
      track.duration = updateTrackDto.duration;
    }

    if (updateTrackDto.albumId !== undefined) {
      if (!track.album) {
        track.album = { id: updateTrackDto.albumId } as Album;
      }
    }

    if (updateTrackDto.artistId !== undefined) {
      if (!updateTrackDto.artistId) {
        throw new NotFoundException(
          `Artist with ID ${updateTrackDto.artistId} not found`,
        );
      }
      track.album.artist = { id: updateTrackDto.artistId } as Artist;
    }

    await this.tracksRepository.save(track);

    return track;
  }

  remove(id: string) {
    const track = this.tracksRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    this.tracksRepository.delete(id);
  }
}
