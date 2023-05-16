<template>
  <el-radio-group
    v-model="selected"
    class="tab-menus"
    :size="size"
    :disabled="disabled"
    @change="handleChange"
  >
    <el-radio-button
      v-for="m in menus"
      :key="m.value"
      :label="m.value"
      :class="{ 'has-border': border }"
    >
      <i :class="{ [m.icon]: !!m.icon }" class="menu-icon"></i>
      {{ m.label }}
    </el-radio-button>
  </el-radio-group>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number, Boolean],
    default: ''
  },
  /**
   * [
   *  {
   *    label: string;
   *    value: string/number/boolean;
   *  }
   * ]
   */
  menus: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: 'mini'
  },
  fontSize: {
    type: Number,
    default: 14
  },
  border: Boolean,
  disabled: Boolean
})
const emit = defineEmits(['input', 'change'])

const selected = ref('')

watchEffect(() => {
  selected.value = props.value
})

const fontSizeVal = computed(() => {
  return `${props.fontSize}px`
})

function handleChange(event) {
  emit('input', event)
  emit('change', event)
}
</script>

<style lang="scss" scoped>
.tab-menus {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px;
  background: $radio-bg-color;
  border-radius: $base-gap;
  font-size: v-bind(fontSizeVal);

  :deep(.el-radio-button) {
    &.is-active {
      .el-radio-button__inner {
        background-color: $radio-bg-color--active;
        color: $radio-color--active;
      }
      &.has-border {
        .el-radio-button__inner {
          border: 1px solid $primary-color;
          color: $primary-color;
        }
      }
    }

    .el-radio-button__inner {
      border: none;
      color: $radio-color;
      background-color: transparent;
      border-radius: $base-gap;
      box-shadow: none;
      font-size: v-bind(fontSizeVal);

      &:hover {
        color: #1b1c1e;
      }

      .menu-icon {
        margin-right: $base-gap;
        font-size: v-bind(fontSizeVal);
      }
    }

    &.has-border {
      .el-radio-button__inner {
        background: #fff;
        border: 1px solid $border-color;
      }
    }
  }
}
</style>
