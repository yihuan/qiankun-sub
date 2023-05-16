<template>
  <div ref="lineRef" :class="['steps-line', statusClass]">
    <div
      v-if="hideLeftLine"
      class="hide-line__left"
      :style="leftHideLineStyle"
    ></div>
    <div
      v-if="hideRightLine"
      class="hide-line__right"
      :style="rightHideLineStyle"
    ></div>
    <div :class="['steps-node', statusClass]" :style="nodeStyle">
      <template v-if="solid">
        <i
          v-if="isDone"
          class="iconfont icon-icon-64-xuanzhongrenyuan node-icon__done"
        />
        <span v-else class="node-icon__default">·</span>
      </template>
    </div>
    <div :class="['title', 'status-default', statusClass]" :style="titleStyle">
      {{ title }}
    </div>
    <template v-if="isDescArray">
      <div
        v-for="(d, index) in desc"
        :key="index"
        :class="['desc', getDescArrayClass(d.status)]"
      >
        {{ d.title }}【{{ PlanStatusMap[d.status]?.label }}】
      </div>
    </template>
    <template v-else>
      <div :class="['desc', 'status-default', statusClass]">
        {{ desc }}
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { PlanStatus, PlanStatusMap } from '@/constants/plan.const'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  status: {
    type: Number,
    default: 0
  },
  icon: {
    type: String
  },
  desc: {
    type: [String, Array],
    default: ''
  },
  solid: {
    type: Boolean,
    default: true
  },
  nodeSize: {
    type: Number,
    default: 30
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

const baseGap = 4
const primaryColor = '#1564ff'
const statusClassMap = {
  [PlanStatus.INIT]: 'status-init',
  [PlanStatus.PENDING]: 'status-pending',
  [PlanStatus.DONE]: 'status-done'
}
const descArrayClassMap = {
  [PlanStatus.INIT]: 'desc-status__init',
  [PlanStatus.PENDING]: 'desc-status__pending',
  [PlanStatus.DONE]: 'desc-status__done',
  [PlanStatus.DELAYED]: 'desc-status__delayed'
}
const statusClass = computed(
  () => statusClassMap[props.status] || 'status-init'
)

const isDescArray = computed(() => Array.isArray(props.desc))

function getDescArrayClass(status) {
  return descArrayClassMap[status] || 'desc-status__init'
}

const isDone = computed(() => props.status === PlanStatus.DONE)

const nodeSizeAttr = computed(() => props.nodeSize + 'px')
const lineRef = ref(null)
const { width } = useElementSize(lineRef)

const nodeStyle = computed(() => {
  return props.solid
    ? {
        top: `${(props.nodeSize / 2) * -1}px`,
        left: `${width.value / 2 - props.nodeSize / 2}px`
        // backgroundColor: primaryColor
      }
    : {
        top: `${(props.nodeSize / 2) * -1}px`,
        left: `${width.value / 2 - props.nodeSize / 2}px`,
        backgroundColor: '#fff',
        border: `2px solid ${primaryColor}`
      }
})

const titleStyle = computed(() => ({
  marginTop: `${props.nodeSize / 2 + baseGap * 2}px`
}))
const leftHideLineStyle = computed(() => ({
  width: `${width.value / 2}px`
}))
const rightHideLineStyle = computed(() => ({
  width: `${width.value / 2}px`,
  left: `${width.value / 2}px`
}))
</script>

<style lang="scss" scoped>
.steps-line {
  position: relative;
  min-width: 200px;
  border-top: 2px solid $primary-color;
  display: flex;
  flex-direction: column;
  align-items: center;

  &.status-init {
    border-top: 2px solid $secondary-text-color;
  }
  &.status-pending {
    border-top: 2px solid $primary-color;
  }
  &.status-done {
    border-top: 2px solid $primary-color;
  }

  .hide-line__left {
    position: absolute;
    top: -2px;
    left: 0;
    width: 100px;
    border: 1px solid v-bind(hideLineColor);
  }

  .hide-line__right {
    position: absolute;
    top: -2px;
    width: 100px;
    border: 1px solid v-bind(hideLineColor);
  }

  .steps-node {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: v-bind(nodeSizeAttr);
    height: v-bind(nodeSizeAttr);
    border-radius: 50%;
    font-size: 25px;
    color: #fff;
    top: 0;
    left: 0;

    &.status-init {
      border: 2px solid $secondary-text-color;
      background-color: #fff;

      .node-icon__default {
        color: $secondary-text-color;
      }
    }
    &.status-pending {
      background-color: $primary-color;

      .node-icon__default {
        color: #fff;
      }
    }
    &.status-done {
      border: 2px solid $primary-color;
      background-color: #fff;
    }

    .node-icon__done {
      font-size: 16px;
      color: $primary-color;
      font-weight: bolder;
    }
  }

  .status-default {
    color: $secondary-text-color;

    &.status-init {
      color: $secondary-text-color;
    }

    &.status-pending {
      color: $font-color;
      font-weight: 500;
    }

    &.status-done {
      color: $secondary-font-color;
    }
  }

  .title {
    font-size: 14px;
    height: 20px;
    line-height: 20px;
  }

  .desc {
    font-size: 13px;
    margin-top: $base-gap;
    height: 16px;
    line-height: 16px;

    &.desc-status__init {
      color: #50a944;
      font-size: 12px;
    }

    &.desc-status__pending {
      color: $primary-color;
      font-size: 12px;
    }

    &.desc-status__done {
      color: #999999;
      font-size: 12px;
    }

    &.desc-status__delayed {
      color: #d9001b;
      font-size: 12px;
    }
  }
}
</style>
