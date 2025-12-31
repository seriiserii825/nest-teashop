import { BadRequestException, Injectable } from '@nestjs/common';
import IFileResponse from './interfaces/IFileResponse';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async uploadFiles(files: Express.Multer.File[], folder: string = 'products') {
    const uploadedFolder = `${path}/uploads/${folder}`;
    console.log('uploadedFolder', uploadedFolder);
    await ensureDir(uploadedFolder);

    const response: IFileResponse[] = await Promise.all(
      files.map(async (file) => {
        const originalName = `${Date.now()}-${file.originalname}`;
        console.log('originalName', originalName);
        try {
          await writeFile(`${uploadedFolder}/${originalName}`, file.buffer);
          return {
            url: `/uploads/${folder}/${originalName}`,
            name: originalName,
          };
        } catch (error) {
          console.log(error, 'error');
          throw new BadRequestException(`File upload error`);
        }
      }),
    );
    return response;
  }
}
