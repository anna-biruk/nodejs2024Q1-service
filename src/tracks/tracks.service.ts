import { Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { AlbumsService } from 'src/albums/albums.service';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @Inject(AlbumsService) private readonly albumsService: AlbumsService,
  ) {}

  public tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto) {
    return 'This action adds a new track';
  }

  findAll() {
    return `This action returns all tracks`;
  }

  findOne(id: string) {
    const track = this.tracks.find((t) => t.id === id);
    const album = this.albumsService.findOne(track.albumId);
    return {
      ...track,
      album,
    };
  }

  update(id: number, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }
}
