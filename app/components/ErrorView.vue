<template>
  <div class="notFoundContainer">
    <div class="m-b-xxl">
      <h1 class="title">{{title}}</h1>
      <nuxt-link :to="navigateToPage" class="button is-primary">{{navigateToText}}</nuxt-link>
    </div>
    <h2 class="subtitle">
      {{status}}
      <i class="far fa-frown"></i>
    </h2>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    },
    status: {
      required: true,
      type: String
    },
    navigateToPage: {
      required: true,
      type: String
    },
    navigateToText: {
      required: true,
      type: String
    }
  }
}
</script>

<style scoped lang="scss">
  .title {
    font-size: 40px;
  }
  .subtitle {
    font-size: 6rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 5rem !important;
    }
  }
  .notFoundContainer {
    margin-top: 80px;
  }
</style>
