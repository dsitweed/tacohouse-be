import {
  BadRequestException,
  Controller,
  Delete,
  Body,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { JwtGuard } from 'src/common/guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('File')
@Controller('file')
@UseGuards(JwtGuard)
export class FileController {
  constructor(
    private configService: ConfigService,
    private fileService: FileService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @Post('image')
  // https://docs.nestjs.com/techniques/file-upload#basic-example
  // fieldName = file: string that supplies the name of the field from the HTML form that holds a file
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not provided');
    }

    const { size, mimetype } = file;
    const ALLOWED_IMAGE_MIME_TYPES = this.configService.get<string>(
      'ALLOWED_IMAGE_MIME_TYPES',
      'image/jpeg,image/png,image/gif,image/bmp,image/webp,image/svg+xml',
    );
    const DEFAULT_MAX_IMAGE_SIZE = this.configService.get<number>(
      'DEFAULT_MAX_IMAGE_SIZE',
      1024 * 1024 * 2, // 2MB
    );

    if (
      !ALLOWED_IMAGE_MIME_TYPES.includes(mimetype) ||
      size > DEFAULT_MAX_IMAGE_SIZE
    ) {
      throw new BadRequestException('Invalid type or invalid size');
    }

    return this.fileService.uploadFile(
      file.originalname,
      file.mimetype,
      file.buffer,
    );
  }

  @Delete()
  async deleteFile(@Body('fileUrl') fileUrl: string) {
    return this.fileService.deleteFile(fileUrl);
  }

  @Post('file')
  // https://docs.nestjs.com/techniques/file-upload#basic-example
  // fieldName = file: string that supplies the name of the field from the HTML form that holds a file
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { size, mimetype } = file;
    const ALLOWED_FILE_MIME_TYPES = this.configService.get<string>(
      'ALLOWED_FILE_MIME_TYPES',
      'application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    const DEFAULT_MAX_FILE_SIZE = this.configService.get<number>(
      'DEFAULT_MAX_FILE_SIZE',
      1024 * 1024 * 5, // 5MB
    );

    if (
      !ALLOWED_FILE_MIME_TYPES.includes(mimetype) ||
      size > DEFAULT_MAX_FILE_SIZE
    ) {
      throw new BadRequestException('Invalid type or invalid size');
    }

    return {
      url: await this.fileService.uploadFile(
        file.originalname,
        file.mimetype,
        file.buffer,
      ),
    };
  }
}
