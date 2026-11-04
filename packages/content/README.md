# @skilitlab/content

共享内容包：`/learning` 页面的 markdown 单一事实源。

- `notes/` —— 学习笔记（一个概念一个文件，带 frontmatter）
- 将来可加 `posts/`（成品长文）、`projects/`（项目 README）

`apps/web` 通过符号链接 `apps/web/content -> ../../packages/content` 读取这里；
将来 `apps/web-react`（React 版）也读同一个目录，内容只维护一份。

> 命名规范：`YYYY-MM-DD-kebab-slug.md`，中文标题写在 frontmatter 的 `title` 里。
