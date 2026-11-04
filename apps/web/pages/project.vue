<script setup lang="ts">
import type { Project } from '@skilitlab/types'

const { data: projects, pending, error } = await useFetch<Project[]>('/api/projects', {
  server: false,
})
</script>

<template>
  <section>
    <h1>项目</h1>
    <p class="subtitle">所有做过的作品</p>

    <p v-if="pending" class="empty">加载中…</p>
    <p v-else-if="error" class="empty">加载失败：请确认后端已启动（docker compose up -d postgres 后 pnpm dev:api）。</p>

    <ul v-else class="project-list">
      <li v-for="p in projects" :key="p.slug" class="project-card">
        <div class="project-head">
          <h2>{{ p.name }}</h2>
          <span class="status" :class="`status-${p.status}`">{{ p.status }}</span>
        </div>
        <p class="project-desc">{{ p.description }}</p>
        <div class="tag-row">
          <span v-for="s in p.stack" :key="s" class="tag">{{ s }}</span>
        </div>
        <div class="link-row">
          <a v-if="p.demo" :href="p.demo" target="_blank" rel="noopener">Demo</a>
          <a v-if="p.repo" :href="p.repo" target="_blank" rel="noopener">源码</a>
          <a v-if="p.docs" :href="p.docs" target="_blank" rel="noopener">文档</a>
        </div>
      </li>
    </ul>
  </section>
</template>
