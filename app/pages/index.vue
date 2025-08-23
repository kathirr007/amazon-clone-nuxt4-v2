<script setup lang="ts">
const { data: products, error, status } = await useFetch('/api/products', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  lazy: true,
  server: false // Add this to prevent hydration mismatch
})
</script>

<template>
  <div>
    <h3>Nuxt subsystem demo updated</h3>
    <ClientOnly> <!-- Wrap loading state in ClientOnly -->
      <div v-if="status === 'pending'">
        Loading...
      </div>
      <div v-else>
        <pre>
          {{ products }}
        </pre>
      </div>
    </ClientOnly>
  </div>
</template>