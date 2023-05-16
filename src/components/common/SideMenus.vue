<!---
  详情页左侧带图标菜单
-->
<template>
  <el-menu :default-active="activePath" :router="router" class="side-menus">
    <el-menu-item
      v-for="m in menus"
      :key="m.path"
      :index="m.path.split('/')[3]"
      :style="m.bottom ? bottomStyle : {}"
      :route="getMenuRoute(m.path, m.query)"
    >
      <template #title>
        <i :class="['iconfont', m.icon || '', 'menu-item__icon']" />
        <span class="menu-item__title">{{ m.title }}</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { ITEM_TYPE } from '@/constants/item.const'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router/composables'

const IterationRoutes = ['iteration', 'iteration-overview']
const props = defineProps({
  /**
   * menu: {
   *  title: String;
   *  icon: String;
   *  path: String; // router path
   *  query: Object; // router query object
   * }
   */
  menus: {
    type: Array,
    required: true,
    default: () => []
  },
  router: {
    type: Boolean,
    default: true
  }
})

const bottomStyle = {
  position: 'absolute',
  bottom: '10px'
}

const hasSubMenus = computed(() =>
  props.menus.reduce((ret, curr) => {
    if (curr.hasSubMenus) {
      ret[curr.path] = true
    }
    return ret
  }, {})
)

const route = useRoute()
const activePath = ref('overview')

const getMenuRoute = (path, query) => {
  if (props.router) {
    // const query = JSON.parse(JSON.stringify(query))
    // delete query.dc
    // delete query.leader
    // delete query.userName
    // delete query.projId
    // delete query.type
    // delete query.filterType

    return {
      path,
      query
    }
  }
  return {}
}

const getMenuActiveIndex = (path, query) => {
  const pathArr = path.split('/')
  let pathstr = pathArr.length > 0 ? pathArr[3] : 'overview'

  // 迭代详情页
  if (IterationRoutes.includes(pathstr)) {
    pathstr = 'iterations'

    return pathstr
  }

  // 事项详情页
  if (path.includes('/items/')) {
    const workType = query.type || 2

    if (workType == ITEM_TYPE.ISSUE) {
      pathstr = 'requirements'
    }

    if (workType == ITEM_TYPE.BUG) {
      pathstr = 'bugs'
    }

    if (workType == ITEM_TYPE.TASK) {
      pathstr = 'tasks'
    }
  }

  return pathstr
}

watch(
  () => route.query,
  () => {
    if (route.query.type) {
      activePath.value = getMenuActiveIndex(route.path, route.query)
    }
  }
)

const matched = route.matched
if (matched.length > 1) {
  const parentPath = matched[1].path
  activePath.value = hasSubMenus.value[parentPath]
    ? parentPath
    : getMenuActiveIndex(route.path, route.query)
} else {
  activePath.value = route.path
}
</script>

<style lang="scss">
.side-menus.el-menu {
  padding-top: 10px;
  background-color: #f5f7f9;
  border-right: none;

  display: flex;
  flex-direction: column;
  align-items: center;

  .el-menu-item {
    height: 70px;
    width: 70px;
    padding: 8px 0 !important;
    line-height: unset;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $icon-color;

    &:hover {
      // hover态要调整一下，参考设计稿（70*70，圆角4px，#E4E7ED）
      background-color: #e4e7ed;
      border-radius: 4px;
    }

    &:focus {
      background-color: transparent;
    }

    .menu-item__icon {
      font-size: 30px;
      color: $icon-color;
    }

    &.is-active {
      color: $primary-color;

      .menu-item__icon {
        color: $primary-color;
      }
    }

    .menu-item__title {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      margin-top: 4px;
    }
  }
}
</style>
