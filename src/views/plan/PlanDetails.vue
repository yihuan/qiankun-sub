<template>
  <div class="plan-details">
    <div class="details-header">
      <TabMenu
        v-model="menu"
        :menus="menus"
        size="medium"
        @change="handleChange"
      />
      <div v-show="showRight" class="header-right">
        <el-input
          v-model="search"
          placeholder="任务名称"
          prefix-icon="el-icon-search"
          class="right-item"
          @input="handleSearch"
        />
        <PlanProgressFilter
          class="right-item"
          :fetch="showRight"
          :plan-id="id"
          @update="handleFilterUpdate"
        />
        <el-button class="right-item" @click="handleShowRecords">
          历史记录
        </el-button>
      </div>
    </div>
    <router-view :task-name="route.query.taskName" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router/composables'
import TabMenu from '@/components/common/TabMenu.vue'
import PlanProgressFilter from '@/components/plan/PlanProgressFilter.vue'
import { debounce } from '@/utils'
import { usePlanStore } from '@/stores'
import { getPlanFlows } from '@/request/apis'

const router = useRouter()
const route = useRoute()
const planStore = usePlanStore()

const menus = [
  {
    label: '概览',
    value: 'overview'
  },
  {
    label: '版本进展',
    value: 'progress'
  },
  {
    label: '构建包',
    value: 'build'
  },
  {
    label: '流水线',
    value: 'flow'
  },
  {
    label: '版本日历',
    value: 'calendar'
  }
]

const search = ref(route.query.taskName ?? '')

const routeNameMap = {
  PlanDetailsOverview: 'overview',
  PlanDetailsProgress: 'progress',
  PlanDetailsBuild: 'build',
  PlanDetailsFlow: 'flow',
  PlanDetailsCalendar: 'calendar'
}

const menu = ref(routeNameMap[route.name])
const showRight = computed(() => menu.value === 'progress')

const id = computed(() => route.params.id)

getPlanFlows(id.value).then((res) => {
  planStore.flows = res?.data?.data ?? []
})

function handleChange(menu) {
  router.push(`/plan/${id.value}/${menu}`)
}

const handleSearch = debounce((val) => {
  planStore.$patch({ progressActions: { filter: { name: val } } })
}, 300)

function handleFilterUpdate(filter) {
  planStore.$patch({ progressActions: { filter } })
}

function handleShowRecords() {
  planStore.$patch((state) => {
    state.progressActions.records = true
  })
}
</script>

<style lang="scss" scoped>
.plan-details {
  height: 100%;
  .details-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-right {
      display: flex;
      align-items: center;

      .right-item {
        margin-right: $base-gap * 4;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
