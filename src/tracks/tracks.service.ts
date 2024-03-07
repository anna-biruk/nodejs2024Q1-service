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
import { AlbumsService } from 'src/albums/albums.service';
import { Track } from './entities/track.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TracksService {
  constructor(
    @Inject(AlbumsService) private readonly albumsService: AlbumsService,
  ) {}

  public tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto) {
    const { artistId, albumId } = createTrackDto;
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new HttpException(
        'Name and duration are required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newTrack = {
      ...createTrackDto,
      id: uuid(),
      artistId: artistId || null,
      albumId: albumId || null,
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    if (updateTrackDto.name && typeof updateTrackDto.name !== 'string') {
      throw new HttpException('Name must be a string', HttpStatus.BAD_REQUEST);
    }
    if (
      updateTrackDto.duration !== undefined &&
      typeof updateTrackDto.duration !== 'number'
    ) {
      throw new HttpException(
        'Duration must be a number',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (updateTrackDto.name) {
      track.name = track.name;
    }
    if (updateTrackDto.duration) {
      track.duration = updateTrackDto.duration;
    }

    return track;
  }

  remove(id: string) {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    this.tracks.splice(trackIndex, 1);
  }
}
