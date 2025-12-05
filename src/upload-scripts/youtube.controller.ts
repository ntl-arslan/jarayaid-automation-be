import {
  Controller,
  Get,
  Query,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Readable } from 'node:stream';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly yt: YoutubeService) {}

  @Get('auth')
  getAuthUrl() {
    return { url: this.yt.getAuthUrl() };
  }

  @Get('oauth/callback')
  async oauthCallback(@Query('code') code: string) {
    const token = await this.yt.handleOAuthCallback(code);
    return { message: 'Authentication successful', token };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('video'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Video file missing');
    
    const stream = Readable.from(file.buffer);
  
    const videoId = await this.yt.uploadVideoFromStream(
      stream,
      file.mimetype,
      file.originalname
    );

    // Arabic playlist
    const playlistTitle = 'أخبار';

    let playlistId = await this.yt.findPlaylistByTitle(playlistTitle);
    if (!playlistId) {
      playlistId = await this.yt.createPlaylist(playlistTitle);
    }

    await this.yt.addToPlaylist(videoId, playlistId);

    return {
      uploaded: true,
      videoId,
      url: `https://youtu.be/${videoId}`,
    };
  }

  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async thumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Query('videoId') videoId: string,
  ) {
    if (!videoId) throw new BadRequestException('videoId missing');
    if (!file) throw new BadRequestException('Thumbnail missing');

    await this.yt.setThumbnail(videoId, file.path);
    return { thumbnail: 'set', videoId };
  }
}
