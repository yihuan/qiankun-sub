<template>
  <el-tag
    :class="[
      'icon-tag',
      hasText ? '' : 'icon-padding',
      disabled ? 'tab-disabled' : ''
    ]"
    :disable-transitions="true"
    @click="handleClick"
  >
    <i
      v-if="props.iconClass"
      :class="iconClasses"
      :style="{ fontSize: iconFontSize || '14px' }"
    />
    <i
      v-if="hasText"
      class="icon-tag__text"
      :class="[disabled ? 'tab-disabled' : '']"
    >
      {{ text }}
    </i>
  </el-tag>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  iconClass: {
    type: String
  },
  iconColor: {
    type: String,
    default: '#1B1C1E'
  },
  iconfont: {
    type: Boolean,
    default: true
  },
  text: {
    type: String
  },
  disabled: {
    type: [Boolean, Number, String],
    default: false
  },
  iconFontSize: {
    type: String
  }
})
const emit = defineEmits(['click'])

const iconClasses = computed(() => [
  props.iconfont ? 'iconfont' : '',
  'icon-tag__icon',
  props.iconClass,
  props.disabled ? 'tab-disabled' : ''
])
const hasText = computed(() => !!props.text)

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style lang="scss">
.tab-disabled {
  color: rgba(27, 28, 30, 1) !important;
  cursor: not-allowed !important;
}
.icon-tag.el-tag {
  cursor: pointer;
  background-color: #ffffff;
  color: rgba(27, 28, 30, 1);
  border: 1px solid rgba(228, 231, 237, 1);
  border-radius: 4px;
  font-size: 0px;

  &.icon-padding {
    padding: 0 3px;
  }

  .icon-tag__icon {
    color: v-bind(iconColor);
    // margin-right: 8px;
    font-size: 14px;
    vertical-align: middle;
  }

  .icon-tag__text {
    line-height: 30px;
    padding-left: 0px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    vertical-align: middle;
  }
}
</style>
