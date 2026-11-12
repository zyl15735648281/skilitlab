export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxt/content'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'skilitlab',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'skilitlab — 学习记录 · 3D 简历 · 项目展示' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // 生产环境走 nginx 反代，用相对路径 /api；本地开发由 devProxy 转发
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        // Nitro devProxy 按前缀匹配并剥离前缀再转发（见 nitropack 源码注释：
        // "Routes match by prefix and the prefix is stripped from the forwarded URL"），
        // 而 API 全局前缀也是 /api（生产 nginx 保留前缀），所以 target 需补回 /api。
        target: process.env.API_PROXY_TARGET || 'http://localhost:3001/api',
        changeOrigin: true,
      },
    },
  },
})
