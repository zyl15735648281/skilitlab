<script setup lang="ts">
import type { Resume } from '@skilitlab/types'

const { data: resume } = await useFetch<Resume>('/api/resume', { server: false })
</script>

<template>
  <section>
    <h1>3D 简历</h1>
    <p class="subtitle">{{ resume ? `${resume.name} · ${resume.title}` : '可交互的面试简历' }}</p>

    <ClientOnly>
      <InterviewScene :name="resume?.name" />
      <template #fallback>
        <div class="scene-loading">3D 场景加载中…</div>
      </template>
    </ClientOnly>

    <div v-if="resume" class="resume-panel">
      <p class="resume-summary">{{ resume.summary }}</p>

      <h2>技能</h2>
      <div class="tag-row">
        <span v-for="s in resume.skills" :key="s" class="tag">{{ s }}</span>
      </div>

      <h2>经历</h2>
      <div v-for="(exp, i) in resume.experience" :key="i" class="exp">
        <strong>{{ exp.role }}</strong>
        <span class="exp-meta">{{ exp.company }} · {{ exp.period }}</span>
        <ul>
          <li v-for="(h, j) in exp.highlights" :key="j">{{ h }}</li>
        </ul>
      </div>

      <h2>联系</h2>
      <div class="link-row">
        <a v-if="resume.contact.github" :href="resume.contact.github" target="_blank" rel="noopener">GitHub</a>
        <a v-if="resume.contact.site" :href="resume.contact.site" target="_blank" rel="noopener">站点</a>
        <a v-if="resume.contact.email" :href="`mailto:${resume.contact.email}`">邮箱</a>
      </div>
    </div>
  </section>
</template>
