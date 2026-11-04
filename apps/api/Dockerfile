# ===== NestJS API 镜像 =====
# 从仓库根目录构建（build context 为 monorepo 根）：
#   docker build -f apps/api/Dockerfile -t skilitlab-api .
# 说明：v0 骨架采用「整仓拷贝」保证可靠（prisma CLI + 迁移都能跑），
# 后续可用 pnpm deploy + 多阶段裁剪瘦身。

FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@11.22.0 --activate
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @skilitlab/api exec prisma generate
RUN pnpm --filter @skilitlab/api build

FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@11.22.0 --activate
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app ./
EXPOSE 3001

# 启动前先跑数据库迁移，再起服务
CMD ["sh", "-c", "pnpm --filter @skilitlab/api exec prisma migrate deploy && node apps/api/dist/main.js"]
