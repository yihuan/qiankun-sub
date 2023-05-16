<template>
  <div id="sg-app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '@/stores'
import actions from '@/utils/actions.util'

const appStore = useAppStore()

onMounted(() => {
  actions.onGlobalStateChange((state) => {
    const { user, sg } = state
    appStore.$patch({
      currentUser: { ...user },
      appName: sg?.appName ?? '',
      appSwitched: sg?.appSwitched
    })
  }, true)
})
</script>

<style lang="scss">
#sg-app {
  height: 100%;
  background-color: $background-color-base;
}
</style>
