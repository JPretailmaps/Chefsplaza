import {
  HttpCode,
  HttpStatus,
  Controller,
  Get,
  Query,
  Res,
  ValidationPipe,
  UsePipes,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
import { LoadUser } from 'src/modules/auth/guards';
import { DataResponse } from 'src/kernel';
import { FileService } from '../services';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) { }

  @Get('download')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async downloadFile(
    @Res() response: any,
    @Query('key') key: string
  ): Promise<any> {
    const info = await this.fileService.getStreamToDownload(key);
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=${info.file.name}`
    );

    info.stream.pipe(response);
  }

  @Get('/:fileId/status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoadUser)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  public async getFileStatus(
    @Param('fileId') fileId: string,
    @Query() query: any,
    @Request() req: any
  ): Promise<any> {
    const info = await this.fileService.getFileStatus(fileId, query, req.jwToken);
    return DataResponse.ok(info);
  }
}
