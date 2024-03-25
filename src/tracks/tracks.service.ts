import {
  BadRequestException,
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
import { Album } from '../albums/entities/album.entity';
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
    const createdTrack = await this.tracksRepository.save(track);

    return {
      id: createdTrack.id,
      name: createTrackDto.name,
      duration: createTrackDto.duration,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
    };
  }

  findAll() {
    return this.tracksRepository.find();
  }

  async findOne(id: string) {
    const track = await this.tracksRepository.findOne({
      where: { id },
      relations: ['album', 'album.artist'],
    });
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return {
      id: track.id,
      name: track.name,
      duration: track.duration,
      albumId: track.album ? track.album.id : null,
      artistId:
        track.album && track.album.artist ? track.album.artist.id : null,
    };
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
        throw new BadRequestException('Name must be a string');
      }
      track.name = updateTrackDto.name;
    }
    if (updateTrackDto.duration !== undefined) {
      if (isNaN(updateTrackDto.duration)) {
        throw new BadRequestException('Duration must be a number');
      }
      track.duration = updateTrackDto.duration;
    }
    if (updateTrackDto.albumId !== undefined) {
      track.album = { id: updateTrackDto.albumId } as Album;
    }
    if (updateTrackDto.artistId !== undefined) {
      track.album.artist = { id: updateTrackDto.artistId } as Artist;
    }

    const updatedTrack = await this.tracksRepository.save(track);

    return {
      id: updatedTrack.id,
      name: updatedTrack.name,
      duration: updatedTrack.duration,
      artistId: updatedTrack.album?.artist?.id || null,
      albumId: updatedTrack.album?.id || null,
    };
  }

  async remove(id: string) {
    const track = await this.tracksRepository.findOne({
      where: { id },
      relations: ['album', 'album.artist'],
    });
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    await this.tracksRepository.delete(id);
  }
}
