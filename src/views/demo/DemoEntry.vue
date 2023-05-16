<template>
  <div class="component-demos">
    <div class="demo-navs">
      <router-link
        v-for="r in routers"
        :key="r.path"
        :to="{ name: r.name }"
        active-class="active"
      >
        {{ r.name }}
      </router-link>
    </div>
    <router-view class="content" />
  </div>
</template>

<script setup>
import demoRouter from '@/router/demo.router'

const routers = demoRouter.children
</script>

<style lang="scss" scoped>
.component-demos {
  height: 100%;
  padding: $base-gap * 2;
  display: flex;
  flex-direction: row;

  .demo-navs {
    width: 100%;
    margin: $base-gap * 5 0;
    display: flex;
    flex-direction: column;
    flex: 0 0 10%;
    border-right: 1px solid $border-color;

    a {
      text-decoration: none;
      color: $font-color;
      padding: $base-gap * 3 $base-gap * 2;

      &.active {
        color: $primary-color;
      }

      &:not(:last-child) {
        margin-right: $base-gap * 2;
      }
    }
  }

  .content {
    width: 100%;
    padding: $base-gap * 2;
  }
}
</style>
