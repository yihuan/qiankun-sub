<template>
  <div class="flow-section">
    <div class="section-header">
      <div class="section-header__left">
        <span v-html="title"></span>
      </div>
      <div v-if="showMenus" class="section-header__right">
        <SystemTypeSelect v-model="sysType" @change="handleChange" />
      </div>
    </div>
    <div class="section-content">
      <div v-if="showMenus" class="tab-menus">
        <el-tabs
          v-model="activeTab"
          class="tab-menus__left"
          @tab-click="handleClick"
        >
          <el-tab-pane
            v-for="m in menus"
            :key="m.value"
            :label="m.label"
            :name="m.value"
          />
        </el-tabs>
        <!--
        <SystemTypeSelect v-model="sysType" @change="handleChange" />
        -->
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import SystemTypeSelect from '../common/SystemTypeSelect.vue'
import { SystemType } from '@/constants/plan.const'

const props = defineProps({
  title: {
    type: String
  },
  /**
   * [
   *   label: string;
   *   value: string|number;
   * ]
   */
  menus: {
    type: Array,
    default: () => []
  },
  activeMenu: {
    type: [String, Number],
    default: ''
  },
  activeType: {
    type: Number,
    validator: (val) => Object.values(SystemType).includes(val)
  },
  columns: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['app-change', 'menu-click'])

const activeTab = ref('')
const sysType = ref(SystemType.ALL)

const showMenus = ref(true) /* computed(() => !!props.menus?.length) */

watchEffect(() => {
  sysType.value = props.activeType ?? SystemType.ALL
})

watchEffect(() => {
  activeTab.value = props.activeMenu
})

function handleChange(val) {
  emit('app-change', val)
}

function handleClick({ name }) {
  emit('menu-click', name)
}
</script>

<style lang="scss" scoped>
.flow-section {
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    height: 38px;

    .section-header__left {
      padding: $base-gap $base-gap * 2;
      background-color: rgba(21, 100, 255, 0.1);
      border: 1px solid rgba(21, 100, 255, 0.2);
      flex: 1 0 auto;
      font-size: 14px;
      font-weight: 500;
    }

    .section-header__right {
      margin-left: $base-gap * 5;
    }
  }

  .section-content {
    padding: $base-gap * 2 0;

    .tab-menus {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__left {
        flex: 1 0 auto;
        &:deep(.el-tabs) {
          .el-tabs__header {
            .el-tabs__item {
              &.is-focus {
                box-shadow: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
