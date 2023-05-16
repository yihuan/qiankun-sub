<template>
  <div :class="['status-label', classMap[status]]">
    {{ text }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PlanStatus } from '@/constants/plan.const'

const props = defineProps({
  status: {
    type: Number,
    required: true
  }
})

const statusMap = {
  [PlanStatus.INIT]: '待开始',
  [PlanStatus.PENDING]: '进行中',
  [PlanStatus.DONE]: '已完成'
}

const classMap = {
  [PlanStatus.INIT]: 'status-init',
  [PlanStatus.PENDING]: 'status-pending',
  [PlanStatus.DONE]: 'status-done'
}

const text = computed(() => statusMap[props.status])
</script>

<style lang="scss" scoped>
.status-label {
  display: inline-block;
  height: v-bind(height);
  line-height: v-bind(height);
  font-size: 12px;
  font-weight: 400;
  padding: $base-gap $base-gap * 2;

  &.status-init {
    color: #fff;
    background-color: #36b862;
  }

  &.status-pending {
    color: #fff;
    background-color: #1564ff;
  }

  &.status-done {
    color: #fff;
    background-color: #909399;
  }
}
</style>
