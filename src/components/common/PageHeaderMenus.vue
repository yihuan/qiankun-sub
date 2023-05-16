<template>
  <div class="page-header-menus">
    <el-tabs v-model="selected" class="menu-tabs" @tab-click="handleClick">
      <el-tab-pane
        v-for="m in menus"
        :key="m.value"
        :label="m.label"
        :name="m.value"
      />
    </el-tabs>
    <div class="menu-actions">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  defaultActive: {
    type: String
  },
  menus: {
    type: Array,
    default: () => [],
    required: true
  }
})

const emit = defineEmits(['select'])

const selected = ref(props.defaultActive)

watch(
  () => props.defaultActive,
  (defaultActive) => {
    selected.value = defaultActive
  }
)

function handleClick(event) {
  emit('select', event.name)
}
</script>

<style lang="scss" scoped>
.page-header-menus {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .menu-tabs {
    :deep(.el-tabs__header) {
      margin: 0;

      .el-tabs__item {
        &.is-focus {
          box-shadow: none;
        }
      }

      .el-tabs__nav-wrap {
        &::after {
          display: none;
        }

        .el-tabs__nav-scroll {
          width: 100%;
          height: 80px;
          line-height: 80px;

          .el-tabs__nav {
            .el-tabs__active-bar {
              position: absolute;
              left: 0;
              bottom: 17px;
              height: 3px;
              border-radius: 2px;
            }

            .el-tabs__item {
              font-family: PingFangSC-Medium;
              font-size: 16px;
              color: rgba(27, 28, 30, 1);
            }
          }
        }
      }
    }
  }

  .menu-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    & > * {
      margin-left: $base-gap * 3;
    }
  }
}
</style>
