import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  private readonly maxFileSize = 5 * 1000000; // 5 MB
  private readonly allowedExtensions = ['.png', '.jpg'];

  transform(value: Array<any>, metadata: ArgumentMetadata) {
    const extensions = value.map(val => extname(val.originalname))
    const fileSizes = value.map(val => val.size)

    fileSizes.forEach((fileSize, index) => {
      const extension = extensions[index]

      if (!this.allowedExtensions.includes(extension)) {
        throw new BadRequestException(`File type ${extension} is not supported`)
      }

      if (fileSize > this.maxFileSize) {
        throw new BadRequestException(`File size is too large`)
      }
    });

    return value
  }
}