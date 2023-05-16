<template>
  <el-container class="home-view">
    <el-aside :width="asideWidth">
      <el-menu :default-active="activePath" :router="true" class="aside-menus">
        <el-menu-item
          v-for="m in menus"
          :key="m.path"
          :index="'/' + m.path"
          :route="m"
        >
          {{ m.meta.title }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main><router-view /></el-main>
  </el-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router/composables'
import routes from '@/router'
import { useAppStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const asideWidth = '100px'
const activePath = ref(route.path)
const menus = routes[0].children.filter((x) => x.meta?.type === 'menu')

const regexMap = new Map([
  [new RegExp('plan\\/\\d+'), { name: 'PlanList', path: '/plans' }],
  [
    new RegExp('template\\/\\d+'),
    {
      name: 'TemplateList',
      path: '/templates'
    }
  ]
])

// 菜单选中
watch(
  () => route.path,
  (path) => {
    for (const reg of regexMap.keys()) {
      if (reg.test(path)) {
        activePath.value = regexMap.get(reg).path
        break
      }
    }
  },
  { immediate: true }
)

// App 切换跳转到列表页
appStore.$subscribe((mutation, state) => {
  if (state.appSwitched) {
    for (const reg of regexMap.keys()) {
      if (reg.test(route.path)) {
        router.push({
          name: regexMap.get(reg).name
        })
        break
      }
    }
  }
})
</script>

<style lang="scss">
.home-view {
  width: 100%;
  height: 100%;

  .aside-menus {
    height: 100%;
  }
}
</style>
