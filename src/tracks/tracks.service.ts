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
import { v4 as uuid } from 'uuid';

@Injectable()
export class TracksService {
  static tracks: Track[] = [];

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

    TracksService.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return TracksService.tracks;
  }

  findOne(id: string) {
    return TracksService.tracks.find((track) => track.id === id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = TracksService.tracks.find((track) => track.id === id);
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
    const trackIndex = TracksService.tracks.findIndex(
      (track) => track.id === id,
    );
    if (trackIndex === -1) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    TracksService.tracks.splice(trackIndex, 1);
  }

  updateArtistId(artistId: string, value: string | null): void {
    const track = TracksService.tracks.find(
      (track) => track.artistId == artistId,
    );
    if (track) {
      track.artistId = value;
    }
  }
  updateAlbumId(albumId: string, value: string | null): void {
    const track = TracksService.tracks.find(
      (track) => track.albumId == albumId,
    );
    if (track) {
      track.albumId = value;
    }
  }
}
