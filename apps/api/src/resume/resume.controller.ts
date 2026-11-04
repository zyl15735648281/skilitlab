import { Controller, Get } from '@nestjs/common';
import resume from './resume.json';

@Controller('resume')
export class ResumeController {
  @Get()
  getResume() {
    return resume;
  }
}
