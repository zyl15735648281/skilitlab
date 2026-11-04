<script setup lang="ts">
const route = useRoute()
const { data: note } = await useAsyncData(`note-${route.params.slug}`, () =>
  queryContent('/notes')
    .where({ _path: `/notes/${route.params.slug}` })
    .findOne(),
)
</script>

<template>
  <article class="note">
    <div v-if="note">
      <p class="back">
        <NuxtLink to="/learning">← 返回列表</NuxtLink>
      </p>
      <ContentRenderer :value="note" />
    </div>
    <p v-else class="empty">找不到这篇笔记。</p>
  </article>
</template>
