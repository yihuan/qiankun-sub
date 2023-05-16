<template>
  <BaseTable :columns="columns" :data="data">
    <template #version="{ row }">
      <router-link
        class="base-link"
        :to="{
          name: 'PlanDetails',
          params: { id: row.id }
        }"
        target="_blank"
      >
        {{ row.versionNo || '--' }}
      </router-link>
    </template>
    <template #versionStartTime="{ row }">
      {{ row.versionStartTime | date }}
    </template>
    <template #serverOnlineTime="{ row }">
      {{ row.serverOnlineTime | date }}
    </template>
    <template #nativeOnlineTime="{ row }">
      {{ row.nativeOnlineTime | date }}
    </template>
    <template #integrationStartTime="{ row }">
      {{ row.integrationStartTime | date }}
    </template>
    <template #grayPublishTime="{ row }">
      {{ row.grayPublishTime | date }}
    </template>
    <template #publishTime="{ row }">
      <span v-if="!row.iosSubmitTime && !row.androidPublishTime">--</span>
      <span v-else-if="isSameDay(row)">{{ row.iosSubmitTime }}</span>
      <span v-else>
        {{ row.iosSubmitTime | date }}/{{ row.androidPublishTime | date }}
      </span>
    </template>
    <template #iteration="{ row }">
      <BaseTooltip effect="light" popper-class="plan-list__iteration">
        <template #content>
          <span v-for="(it, index) in row.iterations" :key="it.id">
            <a class="base-link" :href="it.url" target="_blank">
              {{ it.title }}
            </a>
            <span v-if="index !== row.iterations.length - 1">,&nbsp;</span>
          </span>
        </template>
        <div class="iteration-list ellipsis">
          <span v-for="(it, index) in row.iterations" :key="it.id">
            <a class="base-link" :href="it.url" target="_blank">
              {{ it.title }}
            </a>
            <span v-if="index !== row.iterations.length - 1">,&nbsp;</span>
          </span>
        </div>
      </BaseTooltip>
    </template>
    <template #status="{ row }">
      {{ PlanStatusMap[row.status]?.label }}
    </template>
    <template #iosRealPublishTime="{ row }">
      {{ row.iosRealPublishTime | date }}
    </template>
    <template #androidRealPublishTime="{ row }">
      {{ row.androidRealPublishTime | date }}
    </template>
    <template #actions="{ row }">
      <el-button
        size="mini"
        :disabled="isDelDisabled(row)"
        @click="() => handleDel(row.id)"
      >
        删除
      </el-button>
      <el-button
        size="mini"
        :disabled="isEditDisabled(row)"
        @click="() => handleEdit(row)"
      >
        编辑
      </el-button>
    </template>
  </BaseTable>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import BaseTable from '@/components/common/BaseTable.vue'
import BaseTooltip from '@/components/common/BaseTooltip.vue'
import { PlanStatus, PlanStatusMap } from '@/constants/plan.const'
import { confirm, Message } from '@/utils'
import { deletePlan } from '@/request/apis'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  hasAuth: {
    type: Boolean
  }
})
const emit = defineEmits(['edit', 'delete'])

const columns = computed(() => {
  return props.hasAuth
    ? [
        {
          name: '版本号',
          key: 'versionNo',
          slot: 'version',
          width: 120
        },
        {
          name: '版本开始时间',
          key: 'versionStartTime',
          slot: 'versionStartTime',
          width: 130
        },
        {
          name: 'server上线时间',
          key: 'serverOnlineTime',
          slot: 'serverOnlineTime',
          width: 130
        },
        {
          name: 'native集成时间',
          key: 'nativeOnlineTime',
          slot: 'nativeOnlineTime',
          width: 130
        },
        {
          name: '集成测试开始时间',
          key: 'integrationStartTime',
          slot: 'integrationStartTime',
          width: 140
        },
        {
          name: '灰度发布时间',
          key: 'grayPublishTime',
          slot: 'grayPublishTime',
          width: 130
        },
        {
          name: '发版时间(iOS提审/Android 发版)',
          key: 'publishTime',
          slot: 'publishTime',
          width: 240
        },
        {
          name: '关联迭代',
          key: 'iteration',
          slot: 'iteration',
          width: 200
        },
        {
          name: '模板',
          key: 'templateName',
          width: 120
        },
        {
          name: '状态',
          key: 'status',
          slot: 'status',
          width: 100
        },
        {
          name: 'iOS 实际发版时间',
          key: 'iosRealPublishTime',
          slot: 'iosRealPublishTime',
          width: 180
        },
        {
          name: 'Android 实际发版时间',
          key: 'androidRealPublishTime',
          slot: 'androidRealPublishTime',
          width: 180
        },
        {
          name: '操作',
          key: 'actions',
          slot: 'actions',
          width: 170
        }
      ]
    : [
        {
          name: '版本号',
          key: 'versionNo',
          slot: 'version',
          width: 120
        },
        {
          name: '版本开始时间',
          key: 'versionStartTime',
          slot: 'versionStartTime',
          width: 130
        },
        {
          name: 'server上线时间',
          key: 'serverOnlineTime',
          slot: 'serverOnlineTime',
          width: 130
        },
        {
          name: 'native集成时间',
          key: 'nativeOnlineTime',
          slot: 'nativeOnlineTime',
          width: 130
        },
        {
          name: '集成测试开始时间',
          key: 'integrationStartTime',
          slot: 'integrationStartTime',
          width: 140
        },
        {
          name: '灰度发布时间',
          key: 'grayPublishTime',
          slot: 'grayPublishTime',
          width: 130
        },
        {
          name: '发版时间(iOS提审/Android 发版)',
          key: 'publishTime',
          slot: 'publishTime',
          width: 240
        },
        {
          name: '关联迭代',
          key: 'iteration',
          slot: 'iteration',
          width: 200
        },
        {
          name: '模板',
          key: 'templateName',
          width: 120
        },
        {
          name: '状态',
          key: 'status',
          slot: 'status',
          width: 100
        },
        {
          name: 'iOS 实际发版时间',
          key: 'iosRealPublishTime',
          slot: 'iosRealPublishTime',
          width: 180
        },
        {
          name: 'Android 实际发版时间',
          key: 'androidRealPublishTime',
          slot: 'androidRealPublishTime',
          width: 180
        }
      ]
})

const isSameDay = computed(() => {
  return (row) => dayjs(row.iosSubmitTime).isSame(dayjs(row.androidPublishTime))
})

function isDelDisabled(row) {
  return row.status === PlanStatus.PENDING || row.status === PlanStatus.DONE
}

function isEditDisabled(row) {
  return row.status === PlanStatus.DONE
}

function handleEdit(row) {
  emit('edit', row)
}

function handleDel(id) {
  confirm('确认删除？删除后不可恢复')
    .then(() => {
      deletePlan(id).then(() => {
        Message.success('删除成功')
        emit('delete')
      })
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
:global(.plan-list__iteration.is-light) {
  max-width: 500px;
  border: 1px solid $border-color;
}

.iteration-list {
  max-width: 150px;
}
</style>
