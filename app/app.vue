<script setup>
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
