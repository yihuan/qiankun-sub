<template>
  <div
    v-if="!isOverload"
    class="saturation-state"
    :class="{ 'greater-than-50': percentage > 50 }"
  ></div>
  <div v-else class="saturation-overload">
    <i class="iconfont icon-icon-20-danchuangtixing icon-overload" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: [String, Number],
    default: 16
  },
  percentage: {
    type: Number,
    validator: (val) => val >= 0
  }
})

const isOverload = computed(() => {
  return props.percentage > 100
})
const size = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})
const rotate = computed(() => {
  return props.percentage <= 50
    ? `rotate(${props.percentage / 100}turn)`
    : `rotate(${(props.percentage - 50) / 100}turn)`
})
</script>

<style lang="scss" scoped>
.saturation-state {
  width: v-bind(size);
  height: v-bind(size);
  border-radius: 50%;
  background: #e8efff;
  background-image: linear-gradient(
    to right,
    transparent 50%,
    $primary-color 0
  );

  &::before {
    content: '';
    display: block;
    margin-left: 50%;
    height: 100%;
    border-radius: 0 100% 100% 0 / 50%;
    background-color: inherit;
    transform-origin: left;
    transform: v-bind(rotate);
  }

  &.greater-than-50 {
    &::before {
      background: $primary-color;
    }
  }
}

.saturation-overload {
  .icon-overload {
    display: inline-block;
    font-size: v-bind(size);
    color: $danger-color;
    transform-origin: center;
    transform: rotate(180deg);
  }
}
</style>
