<template>
  <el-popover
    v-model="visible"
    title="筛选器"
    popper-class="progress-filter-container"
    trigger="click"
    @show="handleShow"
  >
    <template #reference>
      <el-badge
        class="plan-progress-filter"
        :value="selectedCount"
        :hidden="false"
        type="primary"
      >
        <i class="iconfont icon-icon-32-shaixuan icon-filter" />
      </el-badge>
    </template>
    <el-form :model="form" size="mini" label-width="60px">
      <el-form-item label="执行人">
        <EePersonInput v-model="form.operater" :options="form.operater" />
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="form.tag" placeholder="请选择" multiple>
          <el-option
            v-for="t in tagOptions"
            :key="t.code"
            :label="t.msg"
            :value="t.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="请选择" multiple>
          <el-option
            v-for="s in statusOptions"
            :key="s.code"
            :label="s.msg"
            :value="s.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="btn-actions">
        <el-button click="handleReset" @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </el-form-item>
    </el-form>
  </el-popover>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import EePersonInput from '@/components/common/EePersonInput.vue'
import { getPlanFilters } from '@/request/apis/plan.api'

const props = defineProps({
  fetch: {
    type: Boolean
  },
  planId: {
    type: [String, Number]
  }
})
const emit = defineEmits('update', 'show')

const form = reactive({
  operater: [],
  tag: [],
  status: []
})
const tagOptions = ref([])
const statusOptions = ref([])

const visible = ref(false)
const selectedCount = computed(
  () => Object.values(form).filter((x) => !!x?.length).length
)

// 切换标签时加载过滤器数据从而触发版本进展接口加载
watch(
  () => props.fetch,
  (isFetch) => {
    if (isFetch) {
      getFilters()
    }
  }
)

getFilters()

function getFilters() {
  getPlanFilters(props.planId).then((res) => {
    const data = res?.data?.reduce((ret, curr) => {
      ret[curr.keyName] = curr
      return ret
    }, {})
    form.operater =
      data?.operater?.original?.map((x) => ({
        ...x,
        userName: x.code,
        nickName: x.msg
      })) ?? []
    form.tag = data?.tagId?.original ?? []
    form.status = data?.status?.original ?? []
    emitValue()

    tagOptions.value = data?.tagId?.list ?? []
    statusOptions.value = data?.status?.list ?? []
  })
}

function handleShow() {
  emit('show')
}

function handleReset() {
  form.operater = []
  form.tag = []
  form.status = []
}

function handleConfirm() {
  emitValue()
  visible.value = false
}

function emitValue() {
  emit('update', {
    operater: form.operater?.map((x) => x.userName)?.join(',') || '',
    tag: form.tag?.join(',') || '',
    status: form.status?.join(',') || ''
  })
}
</script>

<style lang="scss" scoped>
.plan-progress-filter {
  .icon-filter {
    font-size: 32px;
    border: 1px solid $border-color;
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>

<style lang="scss">
.progress-filter-container.el-popover {
  .btn-actions {
    text-align: right;
  }
}
</style>
