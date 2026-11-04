<script setup lang="ts">
const { data: notes } = await useAsyncData('notes', () =>
  queryContent('/notes').sort({ date: -1 }).find(),
)
</script>

<template>
  <section>
    <h1>学习记录</h1>
    <p class="subtitle">共 {{ notes?.length ?? 0 }} 篇</p>

    <ul class="note-list">
      <li v-for="n in notes" :key="n._path" class="note-item">
        <NuxtLink :to="`/learning/${(n._path as string).split('/').pop()}`">
          <span class="note-title">{{ n.title }}</span>
          <span class="note-meta">
            {{ n.date }} · {{ n.track }} · L{{ n.level }}
            <span v-if="n.tags" class="note-tags">
              <em v-for="t in n.tags" :key="t">#{{ t }}</em>
            </span>
          </span>
        </NuxtLink>
      </li>
    </ul>

    <p v-if="!notes?.length" class="empty">还没有笔记，去 packages/content/notes/ 写第一篇吧。</p>
  </section>
</template>
