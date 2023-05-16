<template>
  <PageVerticalLayout class="plan-list">
    <template #title>
      <TabMenu v-model="menu" :menus="menus" @change="handleTabChange" />
    </template>
    <template v-if="menu === 'data'" #actions>
      <el-input
        v-model="searchParams.versionNo"
        size="mini"
        placeholder="版本号"
        @input="handleVersionSearch"
      />
      <TabMenu
        v-model="searchParams.status"
        :menus="states"
        :border="true"
        @change="handleStatusChange"
      />
      <TabMenu
        v-model="listType"
        :menus="listTypes"
        @change="handleListTypeChange"
      />
      <el-button
        v-if="hasAuth"
        type="primary"
        icon="el-icon-plus"
        @click="handleNew"
      >
        新建版本计划
      </el-button>
    </template>
    <router-view
      :list-type="listType"
      :plans="plans"
      :has-auth="hasAuth"
      @item-delete="handleItemDelete"
      @item-edit="handleItemEdit"
    ></router-view>
    <template #footer>
      <EePagination
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </template>
    <PlanFormDialog
      v-model="dialogVisible"
      :title="title"
      :plan="currentPlan"
      @update="handleUpdate"
    />
  </PageVerticalLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router/composables'
import { useStorage } from '@vueuse/core'
import { debounce } from '@/utils'
import PageVerticalLayout from '@/components/common/PageVerticalLayout.vue'
import TabMenu from '@/components/common/TabMenu.vue'
import EePagination from '@/components/common/EePagination.vue'
import PlanFormDialog from '@/components/plan/PlanFormDialog.vue'
import { IsDelayed, IsTemporary, PlanStatus } from '@/constants/plan.const'
import { usePage } from '@/hooks/use-page'
import { usePlan } from '@/hooks/plan/use-plan'
import { useAuth } from '@/hooks/use-auth'
import { useAppStore } from '@/stores'
import { LocalStorageItem } from '@/constants/common.const'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const savedListType = useStorage(LocalStorageItem.PLAN_LIST_TYPE, 'card')
const savedStatus = useStorage(LocalStorageItem.PLAN_STATUS, PlanStatus.PENDING)

const menu = ref(route.name === 'calendar' ? 'calendar' : 'data')
const menus = [
  {
    label: '计划',
    value: 'data'
  },
  {
    label: '版本日历',
    value: 'calendar'
  }
]
const listType = ref(savedListType.value)
const listTypes = [
  {
    label: '卡片',
    value: 'card',
    icon: 'iconfont icon-icon-16-shitu'
  },
  {
    label: '列表',
    value: 'list',
    icon: 'iconfont icon-icon-16-liebiao'
  }
]
const prodName = computed(() => appStore.appName)

const { PLAN_STATUS_ALL, plans, total, searchParams, getPlans, authData } =
  usePlan(prodName)

const states = [
  {
    label: '进行中',
    value: PlanStatus.PENDING
  },
  {
    label: '待开始',
    value: PlanStatus.INIT
  },
  {
    label: '已完成',
    value: PlanStatus.DONE
  },
  {
    label: '全部',
    value: PLAN_STATUS_ALL
  }
]

const { page, pageSize, handleCurrentChange, handleSizeChange } =
  usePage(getPlans)

const { hasAuth } = useAuth(authData, prodName)

function handleTabChange(event) {
  savedListType.value = event
  router.push(event === 'calendar' ? '/plans/calendar' : '/plans')
}

const handleVersionSearch = debounce((value) => {
  searchParams.versionNo = value
  getPlans(searchParams)
}, 300)

function handleStatusChange(event) {
  savedStatus.value = event
  getPlans(searchParams)
}

function handleListTypeChange(event) {
  savedListType.value = event
}

const dialogVisible = ref(false)
const currentPlan = ref({
  prodName: prodName.value,
  isTemporary: IsTemporary.NO,
  versionNo: '',
  templateId: 0,
  versionStartTime: '',
  serverOnlineTime: '',
  nativeOnlineTime: '',
  integrationStartTime: '',
  grayPublishTime: '',
  iosSubmitTime: '',
  androidPublishTime: '',
  publishCycle: '',
  iterationId: 0,
  isDelay: IsDelayed.NO,
  delayReason: ''
})

const title = ref('新建版本计划')
function handleNew() {
  title.value = '新建版本计划'
  currentPlan.value = null
  dialogVisible.value = true
}

function handleItemDelete() {
  getPlans(searchParams)
}

function handleItemEdit(item) {
  title.value = '编辑版本计划'
  currentPlan.value = { ...item }
  dialogVisible.value = true
}

/**
 * 是否有更新：新建或编辑
 * @param {boolean} isNew
 */
function handleUpdate(isNew) {
  if (isNew) {
    searchParams.status = PlanStatus.INIT
  }
  getPlans(searchParams)
}
</script>

<style lang="scss" scoped>
.plan-list {
  padding: 0;

  &__item-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: $base-gap * 5;
  }
}
</style>
