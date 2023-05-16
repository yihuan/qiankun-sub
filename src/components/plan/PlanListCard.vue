<template>
  <div class="plan-list-card" @click="handleCardClick">
    <div class="card-upper" :style="cardStyle">
      <div class="card-upper__actions">
        <i
          v-if="showEdit"
          class="iconfont icon-icon-48-gengduo btn-more"
          @click.stop="handleEdit"
        />
      </div>
      <div class="card-upper__days">{{ displayDays }}</div>
      <div class="card-upper__date-range">
        {{ displayTimes }}
      </div>
    </div>
    <div class="card-down">
      <div class="card-down__left">
        {{ data.versionNo }}
        <span v-if="data.isTemporary === IsTemporary.YES">(临时版本)</span>
      </div>
      <div class="card-down__right">
        <StatusLabel :status="data.status" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusLabel from './StatusLabel.vue'
import { PlanStatus, IsTemporary } from '@/constants/plan.const'
import { useNavigation } from '@/hooks/use-navigation'
import { formatDate } from '@/utils'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
    required: true
  },
  hasAuth: {
    type: Boolean
  }
})
const emit = defineEmits(['edit'])

const displayDays = computed(() => {
  return props.data.publishCycle ? `${props.data.publishCycle}天` : ''
})
const displayTimes = computed(() => {
  const startTime = formatDate(props.data.versionStartTime)
  const iosEndTime = formatDate(props.data.iosSubmitTime)
  const androidEndTime = formatDate(props.data.androidPublishTime)

  if (startTime) {
    if (!iosEndTime && !androidEndTime) {
      return startTime
    } else if (iosEndTime && androidEndTime) {
      return iosEndTime === androidEndTime
        ? `${startTime} 至 ${iosEndTime}`
        : `${startTime} 至 ${iosEndTime}/${androidEndTime}`
    } else {
      return `${startTime} 至 ${iosEndTime || androidEndTime}`
    }
  } else {
    if (!iosEndTime && !androidEndTime) {
      return ''
    } else if (iosEndTime && androidEndTime) {
      return iosEndTime === androidEndTime
        ? `${iosEndTime}`
        : `${iosEndTime}/${androidEndTime}`
    } else {
      return `${iosEndTime || androidEndTime}`
    }
  }
})
const { openNewTab } = useNavigation()

const cardStyle = computed(() => ({
  background:
    props.data.status === PlanStatus.DONE
      ? 'linear-gradient(to right, #bdc2e8, #e6dee9)'
      : 'linear-gradient(to right, #a6c1ee, #fbc2eb)'
}))

const showEdit = computed(
  () => props.data.status !== PlanStatus.DONE && props.hasAuth
)

function handleCardClick() {
  openNewTab({
    name: 'PlanDetails',
    params: { id: props.data.id }
  })
}

function handleEdit() {
  emit('edit', props.data)
}
</script>

<style lang="scss" scoped>
$card-radius: $base-gap * 2;
$card-padding: $base-gap * 2;

.plan-list-card {
  display: flex;
  flex-direction: column;
  border-radius: $card-radius;
  border: 1px solid $border-color;
  box-shadow: 0px 2px 10px 5px rgba(0, 0, 0, 0.05);
  width: 280px;
  cursor: pointer;

  .card-upper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    border-top-left-radius: $card-radius;
    border-top-right-radius: $card-radius;
    padding: $card-padding;

    &__actions {
      height: 24px;

      .btn-more {
        display: inline-block;
        font-size: 24px;
        color: $icon-color;
        transform: rotate(90deg);
        cursor: pointer;
      }
    }

    &__days {
      height: 28px;
      font-size: 28px;
      font-weight: 500;
      margin: $base-gap * 3 0;
      color: #fff;
    }

    &__date-range {
      height: 14px;
      margin: $base-gap * 2 0;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .card-down {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: $card-padding;

    &__left {
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>
