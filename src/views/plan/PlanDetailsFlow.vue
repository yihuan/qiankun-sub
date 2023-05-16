<template>
  <div>
    <FlowSection
      :title="title"
      :menus="menus"
      :active-menu="activeMenu"
      @app-change="appChange"
      @menu-click="tabPaneClick"
    >
      <BaseTable
        :columns="columns"
        :data="data"
        :max-height="600"
        :height="300"
        :load="tableLoading"
      >
        <template #flowName="{ row }">
          <a class="base-link" :href="row.flowUrl" target="_blank">
            {{ row.flowName }}
          </a>
        </template>
        <template #requirements="{ row }">
          <a
            v-for="r in row.requirements"
            :key="r.name"
            :href="r.url"
            class="base-link iteration-link"
            target="_blank"
          >
            {{ r.name }}
          </a>
        </template>
      </BaseTable>
      <EePagination
        class="pagination-class"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @size-change="sizeChange"
        @current-change="currentChange"
        @prev="prev"
        @next="next"
      ></EePagination>
    </FlowSection>

    <FlowSection :title="releaseTitle" @app-change="releaseAppChange">
      <BaseTable :columns="releaseColumns" :data="releaseData">
        <template #flowName="{ row }">
          <a class="base-link" :href="row.flowUrl" target="_blank">
            {{ row.flowName }}
          </a>
        </template>
      </BaseTable>
    </FlowSection>
    <FlowSection :title="integrateTitle" @app-change="integrateAppChange">
      <BaseTable :columns="integrateColumns" :data="integrateData">
        <template #flowName="{ row }">
          <a class="base-link" :href="row.flowUrl" target="_blank">
            {{ row.flowName }}
          </a>
        </template>
      </BaseTable>
    </FlowSection>
    <FlowSection :title="mergeTitle" @app-change="mergeAppChange">
      <BaseTable :columns="mergeColumns" :data="mergeData">
        <template #flowName="{ row }">
          <a class="base-link" :href="row.flowUrl" target="_blank">
            {{ row.flowName }}
          </a>
        </template>
      </BaseTable>
    </FlowSection>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import FlowSection from '@/components/plan/FlowSection.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import EePagination from '@/components/common/EePagination.vue'
import { SystemType } from '@/constants/plan.const'
import { useBaseStore } from '@/hooks/use-base-store'
import { useAppStore } from '@/stores'
import { useRoute } from 'vue-router/composables'
import {
  getFlowList,
  getReleaseFlowList,
  getIntegrateFlowList,
  getMergeFlowList
} from '@/request/apis'

const route = useRoute()
const id = computed(() => route.params.id)
const appStore = useAppStore()
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(110)
const platform = ref(SystemType.ALL)

const prodName = computed(() => appStore.appName)

const title = ref('')
const menus = ref([
  {
    label: '进行中',
    value: '1'
  },
  {
    label: '已集成',
    value: '2'
  }
])
const activeMenu = ref('1')
const columns = ref([
  { key: 'id', name: '序号', width: 90, tooltip: true },
  { key: 'os', name: '端', width: 100, tooltip: true },
  { key: 'flowName', name: '流水线名称', slot: 'flowName', tooltip: true },
  { key: 'requirementType', name: '类别', tooltip: true },
  {
    key: 'requirements',
    name: '关联需求/缺陷',
    slot: 'requirements',
    tooltip: true
  },
  { key: 'lastStatus', name: '最近运行状态', tooltip: true },
  { key: 'status', name: '状态', tooltip: true },
  { key: 'templateName', name: '流模版', tooltip: true },
  { key: 'runner', name: '最近运行人', tooltip: true },
  { key: 'runTime', name: '最近运行时间', tooltip: true }
])
const data = ref([])

const releaseColumns = ref([
  { key: 'id', name: '序号', width: 90, tooltip: true },
  { key: 'os', name: '端', tooltip: true },
  { key: 'flowName', name: '流水线名称', slot: 'flowName', tooltip: true },
  { key: 'packageType', name: '类型', tooltip: true },
  { key: 'lastStatus', name: '最近运行状态', tooltip: true },
  { key: 'runner', name: '最近运行人', tooltip: true },
  { key: 'runTime', name: '最近运行时间', tooltip: true }
])
const releasePlatform = ref(SystemType.ALL)
const releaseTitle = ref('')
const releaseData = ref([])

const integrateColumns = ref([
  { key: 'id', name: '序号', width: 90, tooltip: true },
  { key: 'os', name: '端', tooltip: true },
  { key: 'flowName', name: '流水线名称', slot: 'flowName', tooltip: true },
  { key: 'requirementType', name: '类别', tooltip: true },
  { key: 'lastStatus', name: '最近运行状态', tooltip: true },
  { key: 'runner', name: '最近运行人', tooltip: true },
  { key: 'runTime', name: '最近运行时间', tooltip: true }
])
const integratePlatform = ref(SystemType.ALL)
const integrateTitle = ref('')
const integrateData = ref([])

const mergeColumns = ref([
  { key: 'id', name: '序号', width: 90, tooltip: true },
  { key: 'os', name: '端', tooltip: true },
  { key: 'flowName', name: '流水线名称', slot: 'flowName', tooltip: true },
  { key: 'status', name: '状态', tooltip: true },
  { key: 'runner', name: '最近运行人', tooltip: true }
])
const mergePlatform = ref(SystemType.ALL)
const mergeTitle = ref('')
const mergeData = ref([])

function tabPaneClick(name) {
  activeMenu.value = name
  currentPage.value = 1
  getTable()
}
/** 页码变更 */
function sizeChange(size) {
  pageSize.value = size
  getTable()
}
function currentChange(page) {
  currentPage.value = page
  getTable()
}
function prev(page) {
  currentPage.value = page
  getTable()
}
function next(page) {
  currentPage.value = page
  getTable()
}

function appChange(val) {
  platform.value = val
  getTable()
}
function releaseAppChange(val) {
  releasePlatform.value = val
  getReleaseTable()
}
function integrateAppChange(val) {
  integratePlatform.value = val
  getIntegrateTable()
}
function mergeAppChange(val) {
  mergePlatform.value = val
  getMergeTable()
}

const { updateProductName } = useBaseStore()
const tableLoading = ref(false)
function getTable() {
  tableLoading.value = true
  getFlowList({
    productName: prodName.value,
    version: '9.9.9',
    id: id.value,
    flowTypeStatus: activeMenu.value,
    platform: platform.value,
    page: currentPage.value,
    pageSize: pageSize.value
  }).then((res) => {
    tableLoading.value = false
    let resData = res.data
    title.value = resData?.message
    currentPage.value = resData?.pageNum
    pageSize.value = resData.pageSize
    total.value = resData.totalCount
    data.value = resData.data
    updateProductName(resData?.productName)
  })
}

function getReleaseTable() {
  getReleaseFlowList({
    productName: prodName.value,
    version: '9.9.9',
    id: id.value,
    platform: releasePlatform.value
  }).then((res) => {
    const data = res?.data
    releaseTitle.value = data.message
    releaseData.value = data.list
  })
}

function getIntegrateTable() {
  getIntegrateFlowList({
    productName: prodName.value,
    version: '9.9.9',
    id: id.value,
    platform: integratePlatform.value
  }).then((res) => {
    const data = res?.data
    integrateTitle.value = data?.message
    integrateData.value = data?.list
  })
}

function getMergeTable() {
  getMergeFlowList({
    productName: prodName.value,
    version: '9.9.9',
    id: id.value,
    platform: mergePlatform.value
  }).then((res) => {
    const data = res?.data
    mergeTitle.value = data?.message
    mergeData.value = data?.list
  })
}

onMounted(() => {
  getTable()
  getReleaseTable()
  getIntegrateTable()
  getMergeTable()
})
</script>

<style lang="scss" scoped>
.pagination-class {
  margin: 10px auto 30px auto;
}
</style>
