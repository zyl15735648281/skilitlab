<template>
  <div class="site">
    <header class="site-header">
      <NuxtLink to="/" class="brand">skilitlab</NuxtLink>
      <nav class="nav">
        <NuxtLink to="/learning">学习</NuxtLink>
        <NuxtLink to="/project">项目</NuxtLink>
        <NuxtLink to="/interview">3D 简历</NuxtLink>
      </nav>
    </header>

    <main class="site-main">
      <NuxtPage />
    </main>

    <footer class="site-footer">
      <p>skilitlab · 记录 · 复现 · 交付</p>
    </footer>
  </div>
</template>
