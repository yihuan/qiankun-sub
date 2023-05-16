<template>
  <div class="plan-steps">
    <PlanStep
      v-for="(s, index) in steps"
      :key="index"
      :title="s[titleProp]"
      :status="s[statusProp]"
      :hide-left-line="isHideLeftLine(index)"
      :hide-right-line="isHideRightLine(index)"
      :desc="s[descProp]"
      :icon="s[iconProp]"
      :node-size="nodeSize"
      :solid="solid"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PlanStep from './PlanStep.vue'

const props = defineProps({
  /**
   *[
   *  {
   *    icon: string;
   *    title: string;
   *    desc: string|Array; - [{title: string, status: number}]
   *    status: number;
   *  }
   * ]
   */
  steps: {
    type: Array,
    default: () => []
  },
  prop: {
    type: Object,
    default: () => ({
      icon: 'icon',
      title: 'title',
      status: 'status',
      desc: 'desc'
    })
  },
  nodeSize: {
    type: Number,
    default: 30
  },
  solid: {
    type: Boolean,
    default: true
  },
  hideLeftLine: {
    type: Boolean,
    default: false
  },
  hideRightLine: {
    type: Boolean,
    default: false
  },
  hideLineColor: {
    type: String,
    default: '#fff'
  }
})

const iconProp = computed(() => props.prop.icon || 'icon')
const titleProp = computed(() => props.prop.title || 'title')
const statusProp = computed(() => props.prop.status || 'status')
const descProp = computed(() => props.prop.desc || 'desc')

function isHideLeftLine(index) {
  return props.hideLeftLine || index === 0
}

function isHideRightLine(index) {
  return props.hideRightLine || index === props.steps.length - 1
}
</script>

<style lang="scss" scoped>
.plan-steps {
  width: 100%;
  overflow-x: auto;
  display: flex;
  align-items: flex-start;
  padding: $base-gap * 4 0;
}
</style>
