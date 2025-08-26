<script setup lang="ts">
definePageMeta({
    middleware: ["auth"]
})
</script>

<template>
    <div>
        Protected page to access only authenticated users
    </div>
</template>

<style scoped>

</style>