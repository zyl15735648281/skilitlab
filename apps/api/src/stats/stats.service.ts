import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [notes, totalProjects] = await Promise.all([
      this.prisma.note.findMany({ select: { track: true, level: true } }),
      this.prisma.project.count(),
    ]);

    const byTrack: Record<string, number> = {};
    const byLevel: Record<string, number> = {};
    for (const n of notes) {
      byTrack[n.track] = (byTrack[n.track] ?? 0) + 1;
      byLevel[String(n.level)] = (byLevel[String(n.level)] ?? 0) + 1;
    }

    return {
      totalNotes: notes.length,
      totalProjects,
      byTrack,
      byLevel,
      lastUpdated: new Date().toISOString(),
    };
  }
}
