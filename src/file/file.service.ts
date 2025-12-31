import { Injectable } from '@nestjs/common';
import IFileResponse from './interfaces/IFileResponse';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
    const uploadedFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadedFolder);

    const response: IFileResponse[] = await Promise.all(
      files.map(async (file) => {
        const originalName = `${Date.now()}-${file.originalname}`;
        await writeFile(`${uploadedFolder}/${originalName}`, file.buffer);
        return {
          url: `/uploads/${folder}/${originalName}`,
          name: originalName,
        };
      }),
    );
    return response;
  }
}
