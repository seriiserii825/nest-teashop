import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload-file.dto';
import { fileResponse } from './response/file.response';

@Auth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseInterceptors(FilesInterceptor('files'))
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @HttpCode(200)
  @ApiBody({ type: UploadFileDto })
  @ApiOkResponse(fileResponse)
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    return this.fileService.uploadFiles(files, folder);
  }
}
