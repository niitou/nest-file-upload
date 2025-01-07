import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from './file-validation/file-validation.pipe';
import { FilesValidationPipe } from './files-validation/files-validation.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Upload Single File
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(new FileValidationPipe() /* File validation using a pipe */) file: Express.Multer.File) {
    return file
  }

  // Upload Multiple Files
  @Post('uploads')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFiles(@UploadedFiles(new FilesValidationPipe()) files: Array<Express.Multer.File>) {
    return files
  }
}
