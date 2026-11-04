/**
 * @skilitlab/types —— 全仓共享的 TypeScript 类型。
 * 纯类型定义（用 `export type`），编译后不产生运行时代码，
 * 因此 Nuxt（ESM）和 NestJS（CJS）都能安全引用。
 */

export type Track = 'frontend' | 'gis' | 'node' | 'pm' | string;

/** 一条学习笔记的元数据（对应 /learning 里的一篇 markdown） */
export interface Note {
  slug: string;
  title: string;
  date: string;
  track: Track;
  tags: string[];
  /** 掌握等级：1=能复述 2=能画图 3=能手写 4=能讲取舍 5=能改进源码 */
  level: 1 | 2 | 3 | 4 | 5;
  summary?: string;
  source?: string;
}

/** 一个做过的项目（对应 /project 里的一张卡片） */
export interface Project {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  status: 'planning' | 'active' | 'done' | 'archived';
  repo?: string;
  demo?: string;
  docs?: string;
  order: number;
}

/** 简历数据（对应 /interview 的 3D 简历） */
export interface ResumeExperience {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

export interface Resume {
  name: string;
  title: string;
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  featuredProjects: Project[];
  contact: {
    email?: string;
    github?: string;
    site?: string;
  };
}

/** 学习统计（对应后端 /api/stats） */
export interface LearningStats {
  totalNotes: number;
  totalProjects: number;
  byTrack: Record<string, number>;
  byLevel: Record<string, number>;
  lastUpdated: string;
}

/** 通用接口响应包装 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
