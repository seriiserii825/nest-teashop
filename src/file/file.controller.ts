import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Auth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(FilesInterceptor('files'))
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(200)
  @Post()
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    return 'File upload endpoint is under construction.';
    // return this.fileService.uploadFiles(files, folder);
  }
}
