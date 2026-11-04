<template>
  <section class="landing">
    <h1>skilitlab</h1>
    <p class="tagline">记录学习 · 交付作品 · 展示自己</p>
    <div class="cards">
      <NuxtLink to="/learning" class="card">
        <span class="card-icon">📚</span>
        <strong>学习记录</strong>
        <span class="card-desc">笔记、面试卡、认知演进</span>
      </NuxtLink>
      <NuxtLink to="/project" class="card">
        <span class="card-icon">🛠️</span>
        <strong>项目</strong>
        <span class="card-desc">所有做过的作品 + Demo</span>
      </NuxtLink>
      <NuxtLink to="/interview" class="card">
        <span class="card-icon">🧊</span>
        <strong>3D 简历</strong>
        <span class="card-desc">可交互的面试简历</span>
      </NuxtLink>
    </div>
  </section>
</template>
