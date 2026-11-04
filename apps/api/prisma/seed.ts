import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const notes = [
    {
      slug: 'hello-skilitlab',
      title: '欢迎来到 skilitlab',
      date: new Date('2026-11-04T00:00:00Z'),
      track: 'frontend',
      tags: ['meta', '说明'],
      level: 1,
      summary: '第一篇示例笔记，验证 /learning 内容管线。',
    },
    {
      slug: 'js-execution-model',
      title: 'JS 执行模型：编译阶段、执行上下文与调用栈',
      date: new Date('2026-11-03T00:00:00Z'),
      track: 'frontend',
      tags: ['js', '执行上下文', '面试高频'],
      level: 3,
      summary: '变量提升背后的执行上下文与调用栈。',
    },
  ];

  const projects = [
    {
      slug: 'skilitlab',
      name: 'skilitlab',
      description: '本平台：学习记录（/learning）+ 3D 简历（/interview）+ 项目展示（/project）。',
      stack: ['Nuxt 3', 'NestJS', 'Prisma', 'PostgreSQL', 'Docker'],
      status: 'active',
      repo: 'https://github.com/<your-account>/skilitlab',
      demo: 'https://www.skilitlab.top',
      order: 1,
    },
    {
      slug: 'interview-desk',
      name: 'interview-desk',
      description: '面试出卷台：按岗位、简历、技术栈生成带白话答案的前端面试题。',
      stack: ['React 19', 'Vite', 'TypeScript', 'Express'],
      status: 'done',
      order: 2,
    },
    {
      slug: 'night-desk',
      name: 'night-desk',
      description: '深夜作業台：Electron 桌面工作台。',
      stack: ['Electron'],
      status: 'active',
      order: 3,
    },
    {
      slug: 'micro-fe',
      name: 'micro-fe',
      description: '微前端架构方案（待升级为可运行 demo）。',
      stack: ['微前端', 'Vue'],
      status: 'planning',
      order: 4,
    },
  ];

  for (const n of notes) {
    await prisma.note.upsert({ where: { slug: n.slug }, update: n, create: n });
  }
  for (const p of projects) {
    await prisma.project.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  console.log('✅ seed 完成：', notes.length, '篇笔记，', projects.length, '个项目');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
