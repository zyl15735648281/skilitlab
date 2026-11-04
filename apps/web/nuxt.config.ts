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
        target: process.env.API_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
