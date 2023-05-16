<template>
  <div class="colorful-label">
    <span v-if="showIcon" class="colorful-label__icon"></span>
    <span class="colorful-label__text" :style="textStyle">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import variables from '@/assets/styles/var.scss'

const props = defineProps({
  iconColor: {
    type: String
  },
  iconSize: {
    type: Number,
    default: 6
  },
  textColor: {
    type: String,
    default: variables.fontColor
  },
  textBgColor: {
    type: String,
    default: 'transparent'
  },
  fontSize: {
    type: Number,
    default: 14
  },
  text: {
    type: String,
    required: true
  }
})

const textStyle = computed(() => {
  return {
    color: props.textColor,
    backgroundColor: props.textBgColor,
    fontSize: props.fontSize + 'px'
  }
})
const iconSizeProp = computed(() => props.iconSize + 'px')

const showIcon = computed(() => !!props.iconColor)
</script>

<style lang="scss" scoped>
.colorful-label {
  display: flex;
  align-items: center;

  &__icon {
    display: inline-block;
    width: v-bind(iconSizeProp);
    height: v-bind(iconSizeProp);
    border-radius: 50%;
    background-color: v-bind(iconColor);
  }

  &__text {
    display: inline-block;
    padding: $base-gap $base-gap * 3;
    border-radius: 4px;
  }
}
</style>
