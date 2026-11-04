import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(track?: string) {
    return this.prisma.note.findMany({
      where: track ? { track } : undefined,
      orderBy: { date: 'desc' },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.note.findUnique({ where: { slug } });
  }
}
