// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  serverMiddleware: [
    {path: '/api'},
  ],
  modules: [
    '@nuxtjs/tailwindcss'
  ]
});
