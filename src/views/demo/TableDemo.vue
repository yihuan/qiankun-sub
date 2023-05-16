<template>
  <div class="table-demo demo-item">
    <h3>BaseTable</h3>
    <BaseTable :columns="columns" :data="data">
      <template #nickName="{ row, index }">
        <h3>{{ row.nickName }}, index: {{ index }}</h3>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" size="mini" @click="() => handleDelete(row)">
          Delete
        </el-button>
      </template>
    </BaseTable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseTable from '@/components/common/BaseTable.vue'

const columns = [
  {
    name: '名称',
    key: 'name',
    showActions: true
  },
  {
    name: '带slot的名称',
    key: 'nickName',
    slot: 'nickName'
  },
  {
    name: 'desc',
    key: 'desc',
    tooltip: true
  },
  {
    name: 'actions',
    slot: 'actions'
  }
]
const data = ref([
  {
    name: 'name001',
    nickName: 'name with slot',
    desc: '带tooltip的列哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'
  },
  {
    name: 'name002',
    nickName: 'name2 with slot',
    desc: '带toolt带tooltip的列哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈ip的列'
  },
  {
    name: 'name003',
    nickName: 'name3 with slot',
    desc: '带tooltip的列带tooltip的列哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'
  }
])

function handleDelete(row) {
  console.log(row.name + ' deleted') // eslint-disable-line
}
</script>

<style lang="scss" scoped>
@import 'demo';
</style>
