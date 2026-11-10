# skilitlab

个人学习全栈平台：把「知识复习 + 扫盲 + 全栈工程」沉淀成三个可点开的在线页面。

| 路由 | 内容 | 实现 |
|---|---|---|
| `/learning` | 学习记录（笔记/博客） | `@nuxt/content` 读 markdown，SSR 输出 |
| `/interview` | 3D 面试简历 | Vue 组件 + Three.js（按需加载） |
| `/project` | 所有做过的项目 | 调后端 `/api/projects`（全栈链路） |

## 技术栈

| 层 | 选型 |
|---|---|
| Monorepo | pnpm workspaces |
| 前端 | Nuxt 3（Vue 3 + TS）+ @nuxt/content + three |
| 后端 | NestJS + Prisma |
| 数据库 | PostgreSQL |
| 部署 | Docker Compose + Nginx（自建服务器） |

## 目录结构

```
skilitlab/
├── apps/
│   ├── web/          # Nuxt 3 前端（/learning /interview /project）
│   ├── web-react/    # （预留）学完 Vue 后用 React 重写
│   └── api/          # NestJS 后端
├── packages/
│   ├── types/        # 共享 TS 类型
│   └── content/      # 共享 markdown 内容（apps/web/content 软链到这里）
├── docker/
│   ├── nginx.conf    # 反代配置
│   └── ssl/          # HTTPS 证书（不入库）
├── docker-compose.yml
└── pnpm-workspace.yaml
```

**核心约定**：前端只通过 `/api/**` 调后端。将来加 React 版（`apps/web-react`）、加 Java 服务（接管同一批 `/api` 接口），都不碰现有代码。

---

## 一、本地开发

前置：Node ≥ 20.19、pnpm ≥ 10、Docker（起 PostgreSQL 用）。

```bash
# 1. 装依赖
pnpm install

# 2. 准备环境变量（本地连 localhost 的数据库）
cp .env.example .env
cp apps/api/.env.example apps/api/.env

# 3. 起数据库（只起 postgres）
docker compose up -d postgres

# 4. 建表 + 灌入示例数据
pnpm prisma:migrate    # 首次会提示给迁移命名，回车即可
pnpm prisma:seed

# 5. 同时起前后端（web :3000，api :3001）
pnpm dev
```

打开 http://localhost:3000 —— `/learning` 直接可看（markdown 静态渲染）；`/project`、`/interview` 走 `/api`，由 Nuxt devProxy 自动转发到 :3001。

> `pnpm dev` 起两个服务：api 需要 PostgreSQL 已就绪（第 3 步）。没起数据库时 api 会启动失败，属正常现象。

## 二、API 一览

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/health` | 健康检查（不依赖数据库） |
| GET | `/api/notes` | 笔记列表（`?track=frontend` 可按方向过滤） |
| GET | `/api/notes/:slug` | 单条笔记 |
| GET | `/api/projects` | 项目列表 |
| GET | `/api/stats` | 学习统计（总量/按方向/按等级） |
| GET | `/api/resume` | 3D 简历数据 |

---

## 三、手动部署（腾讯云 / 自建服务器，不用 CI 的备选）

> 想「以后只更新内容、自动上线」，直接用下面的 [四、CI/CD 自动部署](#四cicd-自动部署以后只需更新内容)；本节是手动部署的备选路径。

### 0. 前置（一次性，不阻塞写代码）

1. **域名解析**：在 DNS 控制台加 A 记录 `@` 和 `www` → 服务器公网 IP。
2. **ICP 备案**：大陆服务器必须备案（周期约 2–4 周）。备案没下来前，只能先用 `http://服务器IP` 联调。
3. **安全组**：放行 `22`（SSH）、`80`、`443`。

### 1. 服务器装 Docker

```bash
# 以 Ubuntu/Debian 为例
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
# Docker Compose 插件一般随 get.docker.com 一起装好，验证：
docker compose version
```

### 2. 拉代码 + 配环境

```bash
git clone git@github.com:<your-account>/skilitlab.git
cd skilitlab
cp .env.example .env
vim .env   # 改 POSTGRES_PASSWORD 为强密码
```

### 3. 一键构建启动

```bash
docker compose up -d --build
```

`api` 容器启动时会自动执行 `prisma migrate deploy` 建表，再起服务。

### 4. 灌入示例数据（首次）

```bash
docker compose exec api pnpm prisma:seed
```

### 5. 验证

```bash
curl http://localhost/            # 前端首页
curl http://localhost/api/health  # 后端健康检查
curl http://localhost/api/projects
```

浏览器访问 `http://服务器IP`，应能看到三个页面。

### 6. 配置 HTTPS（拿到备案后）

两个方案二选一：

- **certbot 自动续期**（推荐）：
  ```bash
  sudo apt install certbot python3-certbot-nginx
  # 先临时把 nginx 里的 server_name 换成你的域名
  sudo certbot --nginx -d skilitlab.top -d www.skilitlab.top
  ```
  certbot 会自动写 443 配置并配置自动续期。

- **腾讯云 SSL 证书**：控制台申请免费 DV 证书 → 下载 nginx 版 → 把 `fullchain.pem`、`privkey.pem` 放进 `docker/ssl/` → 打开 [docker/nginx.conf](./docker/nginx.conf) 里注释掉的 443 块 → `docker compose exec nginx nginx -s reload`。

---

## 四、CI/CD 自动部署（以后只需更新内容）

目标是：**你改 markdown / 代码 → `git push` → 服务器自动更新，全程不用登录服务器。**

### 流程

```
push main → GitHub Actions 构建镜像（web + api）→ 推送到 GHCR → SSH 到服务器 → pull 镜像 + 重启
```

工作流文件在 [.github/workflows/deploy.yml](./.github/workflows/deploy.yml)，也支持在 Actions 页面手动触发（workflow_dispatch）。

### 4.1 一次性准备

1. **服务器生成 SSH 密钥**，供 GitHub Actions 免密登录：
   ```bash
   ssh-keygen -t ed25519 -C "deploy"        # 一路回车
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys   # 公钥留在服务器
   cat ~/.ssh/id_ed25519                      # 私钥内容，下一步要用
   ```
   > 建议用独立用户 `deploy` 而不是 root；安全组记得放行 22。

2. **在 GitHub 仓库加 Secrets**（Settings → Secrets and variables → Actions → New repository secret）：

   | 名称 | 值 |
   |---|---|
   | `SERVER_HOST` | 服务器公网 IP |
   | `SERVER_USER` | SSH 登录用户（如 `deploy` 或 `root`） |
   | `SERVER_SSH_KEY` | 上一步的私钥内容（整段粘贴） |
   | `SERVER_PORT` | 可选，默认 22 |

3. **让服务器能拉 GHCR 镜像**（二选一）：
   - **推荐：镜像设公开**。GitHub → 头像 → Packages → 找到 `skilitlab-api` 和 `skilitlab-web` → Package settings → Change visibility → Public。之后 `docker pull` 无需登录。
   - 或**保持私有**：在服务器上一次性登录 `docker login ghcr.io -u <你的用户名>`，输入带 `read:packages` 权限的 PAT。

4. **服务器首次部署**（等第一次 CI 跑完、镜像已生成后执行）：
   ```bash
   git clone git@github.com:<你>/skilitlab.git ~/skilitlab
   cd ~/skilitlab
   cp .env.example .env && vim .env    # 改 POSTGRES_PASSWORD、GITHUB_OWNER（小写）
   docker compose -f docker-compose.prod.yml up -d
   docker compose -f docker-compose.prod.yml exec api pnpm prisma:seed   # 灌示例数据
   ```

### 4.2 日常更新（核心体验）

改任意 markdown（如 `packages/content/notes/*.md`）或代码后：

```bash
git add -A && git commit -m "note: 新增 xxx 笔记" && git push
```

GitHub Actions 自动构建 → 推送镜像 → 服务器自动 pull + 重启。等 2–4 分钟，刷新 `https://www.skilitlab.top/learning` 即见新内容。

> 也可以直接在 GitHub 网页上改 markdown 文件并 commit，同样触发部署，连终端都不用开。

### 4.3 回滚

CI 会同时打 `:latest` 和 `:<commit-sha>` 两个 tag。要回滚：把 [docker-compose.prod.yml](./docker-compose.prod.yml) 里 `:latest` 临时改成某个 `:<sha>`，再 `docker compose -f docker-compose.prod.yml up -d`。

---

## 五、后续演进（先留口子，现在不做）

- **React 版**：学完 Vue 后新建 `apps/web-react/`（Next.js），复用 `packages/content` 和同一套 `/api`。
- **Java 服务**：NestJS 的 DI/Controller/Service 概念和 Spring 同构，将来 `apps/api-java/` 接管 `/api` 下同一批接口即可。
- **构建优化**：目前内容更新会整体重建镜像，后续可加「路径过滤」（只改 web 时跳过 api 构建）+ 依赖清单分层缓存，把部署压到 1 分钟内。

## 六、已知注意事项

- 本机开发环境无 Docker 时，无法起 PostgreSQL，`api` 无法启动、`/project` 和 `/interview` 无数据；`/learning` 不受影响。
- Prisma 6 会在命令里提示 `package.json#prisma` 字段已废弃（Prisma 7 将移除）；目前可用，后续可迁到 `prisma.config.ts`。
- 本地 `pnpm install` 若报 `ERR_PNPM_IGNORED_BUILDS`，说明构建脚本被拦，去 `pnpm-workspace.yaml` 的 `allowBuilds` 里把这些包设为 `true`（本仓库已配好）。
