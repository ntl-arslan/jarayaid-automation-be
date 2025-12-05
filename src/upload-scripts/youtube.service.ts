import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.upload',
];

const TOKEN_FILE = path.resolve(__dirname, './yt_token.json');

@Injectable()
export class YoutubeService {
  oauthClient;

  constructor() {

    this.oauthClient = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    this.loadToken();
  }

  // ------------------------------------------------------------------
  // TOKEN LOADING
  // ------------------------------------------------------------------

  loadToken() {
    this.oauthClient.setCredentials({
      refresh_token: process.env.YT_REFRESH_TOKEN
    });
  }

  saveToken(token: any) {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(token));
  }

  // ------------------------------------------------------------------
  // OAUTH
  // ------------------------------------------------------------------

  getAuthUrl() {
    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    });
  }

  async handleOAuthCallback(code: string) {
    const { tokens } = await this.oauthClient.getToken(code);
    this.oauthClient.setCredentials(tokens);
    this.saveToken(tokens);
    return tokens;
  }

  // ------------------------------------------------------------------
  // YOUTUBE CLIENT
  // ------------------------------------------------------------------

  getYoutubeClient() {
    return google.youtube({
      version: 'v3',
      auth: this.oauthClient,
    });
  }

  // ------------------------------------------------------------------
  // ARABIC METADATA
  // ------------------------------------------------------------------

  arabicMetadataForToday() {
    const date = new Date().toLocaleDateString('ar-EG', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const title = `\u202Bنشرة جرايايد | أهم أخبار اليوم – ${date}\u202C`;

    const description = [
      'نشرة موجزة لأبرز الأخبار في المنطقة والعالم، بصيغة عربية مبسّطة.',
      '',
      'الفصول:',
      '00:00 المقدّمة',
      '00:15 الخبر الأول',
      '00:45 الخبر الثاني',
      '01:15 الخبر الثالث',
      '01:45 الخبر الرابع',
      '02:15 الخبر الخامس والخاتمة',
      '',
      'إخلاء المسؤولية:',
      '• يحتوي هذا الفيديو على محتوى دعائي مدفوع.',
      '• يتضمن هذا الفيديو وسائط مولّدة آليًا/معدّلة.',
      '',
      '#أخبار #نشرة_إخبارية #جرايايد #اليوم #عاجل',
    ].join('\n');

    const tags = [
      'أخبار',
      'نشرة إخبارية',
      'جرايايد',
      'اليوم',
      'عاجل',
      'سياسة',
      'اقتصاد',
      'تكنولوجيا',
      'الشرق الأوسط',
      'العالم',
      'ترند',
    ];

    return { title, description, tags };
  }

  // ------------------------------------------------------------------
  // UPLOAD VIDEO FROM FILE
  // ------------------------------------------------------------------

  async uploadVideo(filePath: string) {
    const youtube = this.getYoutubeClient();
    const { title, description, tags } = this.arabicMetadataForToday();

    const body: any = {
      snippet: {
        title,
        description,
        tags,
        categoryId: '25',
        defaultLanguage: 'ar',
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
        containsSyntheticMedia: true,
      },
      paidProductPlacementDetails: { hasPaidProductPlacement: true },
    };

    const media = { body: fs.createReadStream(filePath) };

    try {
      const res = await youtube.videos.insert({
        part: ['snippet', 'status', 'paidProductPlacementDetails'],
        requestBody: body,
        media,
      });

      return res.data.id;
    } catch (e: any) {
      // fallback logic (same as Python)
      const msg = e?.response?.data?.error?.message || '';

      if (msg.includes('contains_synthetic_media')) {
        delete body.status.containsSyntheticMedia;
      }
      if (msg.includes('paidProductPlacementDetails')) {
        delete body.paidProductPlacementDetails;
      }

      const res = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: body,
        media,
      });

      return res.data.id;
    }
  }

  // ------------------------------------------------------------------
  // UPLOAD FROM STREAM (MULTER)
  // ------------------------------------------------------------------

  async uploadVideoFromStream(stream, mimeType, fileName) {
    const youtube = this.getYoutubeClient();

    const res = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: fileName,
          description: '',
        },
        status: {
          privacyStatus: 'public',
        },
      },
      media: {
        mimeType,
        body: stream,
      },
    });

    return res.data.id;
  }

  // ------------------------------------------------------------------
  // THUMBNAIL
  // ------------------------------------------------------------------

  async setThumbnail(videoId: string, thumbnailPath: string) {
    const youtube = this.getYoutubeClient();

    await youtube.thumbnails.set({
      videoId,
      media: { body: fs.createReadStream(thumbnailPath) },
    });

    return true;
  }

  // ------------------------------------------------------------------
  // PLAYLIST
  // ------------------------------------------------------------------

  async findPlaylistByTitle(title: string) {
    const youtube = this.getYoutubeClient();
    let next = null;

    while (true) {
      const res = await youtube.playlists.list({
        part: ['snippet'],
        mine: true,
        maxResults: 50,
        pageToken: next || undefined,
      });

      for (const p of res.data.items || []) {
        if (p.snippet?.title?.trim() === title.trim()) return p.id;
      }

      if (!res.data.nextPageToken) break;
      next = res.data.nextPageToken;
    }

    return null;
  }

  async createPlaylist(title: string) {
    const youtube = this.getYoutubeClient();

    const res = await youtube.playlists.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: { title, description: 'قائمة تشغيل للأخبار' },
        status: { privacyStatus: 'public' },
      },
    });

    return res.data.id;
  }

  async addToPlaylist(videoId: string, playlistId: string) {
    const youtube = this.getYoutubeClient();

    await youtube.playlistItems.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          playlistId,
          resourceId: { kind: 'youtube#video', videoId },
        },
      },
    });

    return true;
  }
}
