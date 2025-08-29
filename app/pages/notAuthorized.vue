<template>
  <div class="container">
    <ErrorView :title="'Ooooops, you are not authorized to visit this page, please talk to administrator in order to get access rights'"
               :status="'401'"
               :navigateToPage="'/'"
               :navigateToText="'Navigate to Home Page'" />
  </div>
</template>

<script setup>
import ErrorView from '@/components/ErrorView'
</script>
