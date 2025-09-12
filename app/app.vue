<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Amazon Clone - Nuxt V4` : 'Amazon Clone - Nuxt V4'
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator color="#f0c14b" />

    <NuxtPage />
  </NuxtLayout>
  <BToastOrchestrator />
  <BModalOrchestrator />
</template>

<style scoped>
.nuxt-loading-indicator {
  opacity: unset !important;
}
</style>
