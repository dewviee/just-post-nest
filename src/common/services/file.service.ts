import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { ETemplateFileName } from '../enum/template-file.enum';

@Injectable()
export class FileService {
  readEjsTemplateFile(fileName: ETemplateFileName) {
    return fs.readFileSync(
      path.join(__dirname, '../../common/templates', fileName),
      'utf-8',
    );
  }
}
