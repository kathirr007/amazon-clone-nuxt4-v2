// plugins/vue3-text-clamp.client.ts
import Vue3TextClamp from 'vue3-text-clamp'

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.component('Vue3TextClamp', Vue3TextClamp)
})
