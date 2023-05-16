<template>
  <el-tooltip
    :placement="placement"
    :effect="effect"
    :content="content"
    :disabled="disabled"
    :visible-arrow="visibleArrow"
    :offset="offset"
    :popper-class="popperClass"
  >
    <template v-if="!!$slots.content" #content>
      <slot name="content" />
    </template>
    <slot />
  </el-tooltip>
</template>

<script setup>
defineProps({
  placement: {
    type: String,
    default: 'top'
  },
  effect: {
    type: String,
    default: 'dark'
  },
  content: String,
  disabled: Boolean,
  visibleArrow: {
    type: Boolean,
    default: true
  },
  offset: {
    type: Number,
    default: 0
  },
  popperClass: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped></style>
