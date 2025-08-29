<template>
  <div class="container">
    <ErrorView :title="'Ooooops, you are not authenticated to visit this page, please login'"
               :status="'401'"
               :navigateToPage="'login'"
               :navigateToText="'Navigate to Login Page'" />
  </div>
</template>

<script setup>
import ErrorView from '@/components/ErrorView'
</script>