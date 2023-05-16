<template>
  <BaseDialog
    v-model="visible"
    :title="title"
    :width="dialogWidth"
    @close="handleClose"
  >
    <BaseTable :loading="loading" :columns="columns" :data="tasks">
      <template #operateTime="{ row }">
        {{ row.operate_time | date('YYYY-MM-DD HH:mm') }}
      </template>
    </BaseTable>
    <template #footer>
      <EePagination
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </template>
  </BaseDialog>
</template>

<script setup>
import { watch, ref, computed, toRef } from 'vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
import BaseTable from '../common/BaseTable.vue'
import EePagination from '@/components/common/EePagination.vue'
import { getPlanRecords, getTaskRecords } from '@/request/apis'
import { usePage } from '@/hooks/use-page'
import { useDialog } from '@/hooks/use-dialog'

const props = defineProps({
  value: {
    type: Boolean
  },
  typeId: {
    type: [String, Number],
    required: true
  },
  type: {
    type: String,
    default: 'plan',
    validator: (value) => ['plan', 'task'].includes(value)
  }
})
const emit = defineEmits(['input'])

const { visible, handleClose } = useDialog(toRef(props, 'value'), emit)

const title = computed(() =>
  props.type === 'plan'
    ? '历史记录 - 版本任务的增删改记录'
    : '历史记录 - 任务的操作历史'
)
const columns = computed(() => {
  return props.type === 'task'
    ? [
        {
          name: '动作',
          key: 'content',
          tooltip: true
        },
        {
          name: '操作人',
          key: 'operater',
          width: 120
        },
        {
          name: '操作时间',
          key: 'operate_time',
          slot: 'operateTime',
          width: 170
        }
      ]
    : [
        {
          name: '类别',
          key: 'operate_type',
          tooltip: true,
          width: 120
        },
        {
          name: '阶段--[标签]任务',
          key: 'content',
          tooltip: true
        },
        {
          name: '操作人',
          key: 'operater',
          width: 100
        },
        {
          name: '操作时间',
          key: 'operate_time',
          slot: 'operateTime',
          width: 165
        }
      ]
})

const dialogWidth = '700px'
const loading = ref(false)
const tasks = ref([])
const total = ref(0)

watch(
  () => props.value,
  (value) => {
    if (value && props.typeId) {
      getRecords()
    }
  }
)

const {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  page,
  pageSize,
  handleCurrentChange,
  handleSizeChange
} = usePage(getRecords, {
  pageProps: {
    page: 'current'
  }
})

function getRecords(params) {
  loading.value = true
  if (props.type === 'task') {
    getTaskRecords({
      nodeAttrId: String(props.typeId),
      current: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      ...params
    })
      .then((res) => {
        tasks.value = res?.data?.data ?? []
        total.value = res?.data?.totalCount ?? 0
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    getPlanRecords({
      scheduleId: String(props.typeId),
      current: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      ...params
    })
      .then((res) => {
        tasks.value = res?.data?.data ?? []
        total.value = res?.data?.totalCount ?? 0
      })
      .finally(() => {
        loading.value = false
      })
  }
}
</script>

<style lang="scss" scoped></style>
