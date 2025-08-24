<script setup lang="ts">
const { data: products, error, status, refresh: refreshProducts } = await useFetch('/api/products/', {
  server: true,  // ✅ fetch during SSR
  lazy: false,   // ✅ fetch immediately (not lazy)
  immediate: true // ✅ makes sure data is ready on first render
})

// Optional: If you want to allow client-side refresh later
onMounted(() => {
  console.log('Component mounted. Products fetched on SSR.')
})

const handleRefreshProduct = async () => {
  await refreshProducts()
}
</script>

<template>
  <div>
    <h3>Nuxt subsystem demo updated</h3>
    
    <div v-if="status === 'pending'">
      Loading...
    </div>
    
    <div v-else-if="error">
      <p class="text-red-500">Failed to load products</p>
    </div>
    
    <div v-else>
      <pre>{{ products }}</pre>
      <button type="button" @click="handleRefreshProduct" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Refresh Products
      </button>
    </div>
  </div>
</template>
