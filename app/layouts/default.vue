<script>
export default {
  name: 'Default',
}
</script>

<template>
  <div>
    <Navbar />
    <slot />
    <Footer />
  </div>
</template>

<style lang="scss">
body {
  font-size: 14px;
  // line-height: 1.25;
  // color: #111;
}
</style>
