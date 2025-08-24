import VitePluginRestart from 'vite-plugin-restart'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      // title: process.env.npm_package_name || "",
      titleTemplate: 'Amazon Clone - Nuxt V4',
      script: [{ src: "https://js.stripe.com/v3" }],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: process.env.npm_package_description || ""
        }
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/icon.png" },
        { rel: "stylesheet", href: "/css/font-awesome/css/all.css" },
        { rel: "stylesheet", href: "/css/default.css" }
      ]
    },
  },
  nitro: {
    preset: 'vercel',
  },
  /* serverHandlers: [
    {
      route: '/api/**',
      // middleware: true,
      handler: './server/api/index.js',
    }
  ], */
  modules: ['@bootstrap-vue-next/nuxt', 'nuxt-auth-utils'],
  css: ['bootstrap/dist/css/bootstrap.min.css'],
})
