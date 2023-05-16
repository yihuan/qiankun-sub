<template>
  <div class="page-not-found">
    <h2>Page Not Found</h2>
    <router-link to="/">回首页</router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.page-not-found {
  width: 100%;
  text-align: center;
  padding: $base-gap * 5;

  h2 {
    margin-bottom: $base-gap * 10;
  }
}
</style>
