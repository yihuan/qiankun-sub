<template>
  <PageVerticalLayout>
    <template #title>主要参与人</template>
    <template #actions>
      <el-button
        v-if="hasAuth"
        type="primary"
        icon="el-icon-plus"
        @click="handleNew"
      >
        新增
      </el-button>
    </template>
    <BaseTable :columns="columns" :data="tableData">
      <template #operation="{ row }">
        <el-button
          size="mini"
          :disabled="!hasAuth"
          @click="() => handleDel(row.id)"
        >
          删除
        </el-button>
      </template>
    </BaseTable>
    <PrimaryParticipantDialog
      v-model="dialogVisible"
      :title="title"
      @close="getList"
    />
  </PageVerticalLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import * as userGroupApi from '@/request/apis/admin.api'
import PageVerticalLayout from '../components/common/PageVerticalLayout.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import PrimaryParticipantDialog from '@/components/admin/PrimaryParticipantDialog.vue'
import { deleteSponsor } from '@/request/apis'
import { confirm, Message } from '@/utils'
import { useAuth } from '@/hooks/use-auth'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const columns = [
  {
    name: '角色',
    key: 'role'
  },
  {
    name: '用户',
    key: 'realName'
  },
  {
    name: '操作',
    slot: 'operation'
  }
]

const tableData = ref([])
const rightData = ref({})

const prodName = computed(() => appStore.appName)
const { hasAuth } = useAuth(rightData, prodName)

getList()

function getList() {
  userGroupApi.getSponsorList({ productName: prodName.value }).then((res) => {
    tableData.value = res.data ?? []
    rightData.value = res.rightData ?? {}
  })
}

function handleDel(id) {
  confirm('确认删除？删除后不可恢复')
    .then(() => {
      deleteSponsor(id).then(() => {
        Message.success('删除成功')
        getList()
      })
    })
    .catch(() => {})
}

const title = ref('新增')
const dialogVisible = ref(false)

function handleNew() {
  title.value = '新增'
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped></style>
