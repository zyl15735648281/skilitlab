import { Controller, Get, Param, Query } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(@Query('track') track?: string) {
    return this.notesService.findAll(track);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.notesService.findBySlug(slug);
  }
}
