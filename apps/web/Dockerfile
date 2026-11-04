# ===== Nuxt Web 镜像 =====
# 从仓库根目录构建（build context 为 monorepo 根）：
#   docker build -f apps/web/Dockerfile -t skilitlab-web .
# Nuxt 构建产物 .output 自包含（含运行时依赖），运行镜像只需 .output。

FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@11.22.0 --activate
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @skilitlab/web build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=build /app/apps/web/.output ./.output
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
