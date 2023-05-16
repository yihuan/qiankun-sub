<template>
  <PageVerticalLayout>
    <template #title>用户组</template>
    <template #actions>
      <el-button
        v-if="hasAuth"
        type="primary"
        icon="el-icon-plus"
        @click="handleNew"
      >
        新建
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
      <template #memberFill="{ row }">
        <EePersonInput
          v-model="row.userInfos"
          :options="row.userInfos"
          :collapse-tags="false"
          :disabled="!hasAuth"
          style="width: 100%"
          @change="handleChange($event, row)"
        />
      </template>
    </BaseTable>
    <UsergroupDialog v-model="dialogVisible" :title="title" @close="getList" />
  </PageVerticalLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import * as userGroupApi from '@/request/apis/admin.api'
import PageVerticalLayout from '../components/common/PageVerticalLayout.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import EePersonInput from '@/components/common/EePersonInput.vue'
import UsergroupDialog from '@/components/admin/UserGroupDialog.vue'
import { confirm, Message } from '@/utils'
import { useAuth } from '@/hooks/use-auth'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const columns = [
  {
    name: '名称',
    key: 'groupName'
  },
  {
    name: '成员',
    key: 'member',
    slot: 'memberFill'
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

watch(
  prodName,
  (name) => {
    if (name) {
      getList()
    }
  },
  { immediate: true }
)

function handleChange(event, rowObj) {
  const member = event.map((x) => x.userName).join(',')
  userGroupApi
    .sgNoticeGroupSave({
      id: rowObj.id,
      tagName: rowObj.tagName,
      member: member,
      productName: prodName.value
    })
    .then(Message.success('更新成功'))
}

function getList() {
  userGroupApi
    .getSgNoticeGroupList({ productName: prodName.value })
    .then((res) => {
      tableData.value = res.data ?? []
      rightData.value = res.rightData ?? {}
    })
}

function handleDel(id) {
  confirm('确认删除？删除后不可恢复')
    .then(() => {
      userGroupApi.deleteSgNoticeGroup(id).then(() => {
        Message.success('删除成功')
        getList()
      })
    })
    .catch(() => {})
}

const title = ref('新建')
const dialogVisible = ref(false)

function handleNew() {
  title.value = '新建'
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped></style>
