import { spawn } from 'child_process';
import * as ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
import { StringHelper } from 'src/kernel';
import { ConvertMp4ErrorException } from '../exceptions';

const os = require('os');

export interface IConvertOptions {
  toPath?: string;
  size?: string; // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#video-frame-size-options
}

export interface IConvertResponse {
  fileName: string;
  toPath: string;
}

export class VideoFileService {
  public async convert2Mp4(
    filePath: string,
    options = {} as IConvertOptions
  ): Promise<IConvertResponse> {
    try {
      const fileName = `${StringHelper.randomString(5)}_${StringHelper.getFileName(filePath, true)}.mp4`;
      const toPath = options.toPath || join(StringHelper.getFilePath(filePath), fileName);
      const cpus = os.cpus().length;
      // TODO - h264 just supports max 4k video
      return new Promise((resolve, reject) => {
        let outputOptions = `-vcodec libx264 -pix_fmt yuv420p -profile:v baseline -level 3.1 -movflags +faststart -strict experimental -preset fast -threads ${Math.round(cpus / 2)} -crf 23 -hide_banner`;
        if (options.size) {
          const sizes = options.size.split('x');
          const width = sizes[0];
          // retain aspect ratio just give height as -1 and it will automatically resize based on the width
          const height = '-1'; // sizes.length > 1 ? sizes[1] : '-1  ';
          outputOptions += ` -vf scale="${width}:${height}"`;
        }

        const q = `ffmpeg -i ${filePath} ${outputOptions} ${toPath}`;
        // use spawn, avoid exception buffer when it is more than 200KB
        const command = spawn(q, [], {
          shell: true,
          // stdin, stdout, stderr
          stdio: ['ignore', 'ignore', 'pipe']
        });
        let e = '';
        command.stderr.on('data', (data) => {
          e += data;
        });
        command.on('exit', (code) => {
          if (!code) {
            resolve({
              fileName,
              toPath
            });
            return;
          }
          reject(new Error(e));
        });
      });
    } catch (e) {
      throw new ConvertMp4ErrorException(e);
    }
  }

  public async getMetaData(filePath: string): Promise<any> {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve, reject) => ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      return resolve(metadata);
    }));
  }

  public async createThumbs(filePath: string, options: {
    toFolder: string;
    count?: number;
    size?: string;
  }): Promise<string[]> {
    let thumbs = [];
    // eslint-disable-next-line no-promise-executor-return, new-cap
    return new Promise((resolve, reject) => new ffmpeg(filePath)
      .on('filenames', (filenames) => {
        thumbs = filenames;
      })
      .on('end', () => resolve(thumbs))
      .on('error', reject)
      .screenshot({
        folder: options.toFolder,
        filename: `${new Date().getTime()}-screenshot-%s.jpg`,
        count: options.count || 3,
        size: options.size || '500x500'
      }));
  }
}
