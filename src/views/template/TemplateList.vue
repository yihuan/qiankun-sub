<template>
  <PageVerticalLayout class="template-list" title="模板">
    <template #actions>
      <el-input
        v-model="search"
        placeholder="模板名称"
        prefix-icon="el-icon-search"
        clearable
        @input="handleSearch"
      />
      <el-button v-if="hasAuth" type="primary" @click="handleCreate">
        <i class="iconfont icon-icon-32-xinjian icon-create" />
        新建模板
      </el-button>
    </template>
    <BaseTable :loading="loading" :columns="columns" :data="templates">
      <template #name="{ row }">
        <router-link
          class="base-link ellipsis"
          :to="{
            name: 'TemplateDetails',
            params: { id: row.id }
          }"
        >
          {{ row.name }}
        </router-link>
      </template>
      <template #type="{ row }">
        {{ templateTypeMap[row.type] }}
      </template>
      <template #createTime="{ row }">
        {{ row.createTime | date }}
      </template>
      <template #action="{ row }">
        <el-button size="mini" @click="() => handleCopy(row.id)">
          复制
        </el-button>
        <el-button size="mini" @click="() => handleDel(row.id)">删除</el-button>
      </template>
    </BaseTable>
    <BaseDialog v-model="createVisible" title="新建模板">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" placeholder="模板名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="mini" @click="handleCancel">取消</el-button>
        <el-button
          :loading="confirmLoading"
          type="primary"
          size="mini"
          @click="handleConfirm"
        >
          确定
        </el-button>
      </template>
    </BaseDialog>
    <template #footer>
      <EePagination
        :total="total"
        :current-page="page"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </template>
  </PageVerticalLayout>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router/composables'
import PageVerticalLayout from '@/components/common/PageVerticalLayout.vue'
import BaseTable from '@/components/common/BaseTable.vue'
import BaseDialog from '@/components/common/BaseDialog.vue'
import EePagination from '@/components/common/EePagination.vue'
import {
  getList,
  createTemplate,
  copyTemplate,
  deleteTemplate
} from '@/request/apis/template.api'
import { usePage } from '@/hooks/use-page'
import { confirm, debounce, Message } from '@/utils'
import { TemplateType, OperateLevel } from '@/constants/template.const'
import { useAuth } from '@/hooks/use-auth'
import { useAppStore } from '@/stores'

const router = useRouter()
const appStore = useAppStore()

const templateTypeMap = {
  [TemplateType.APP]: '应用模板',
  [TemplateType.SYSTEM]: '系统模板'
}
const search = ref('')
const loading = ref(false)
const templates = ref([])
const total = ref(0)
const createVisible = ref(false)
const prodName = computed(() => appStore.appName)
const authData = ref({})
const filterOptions = reactive({
  prodName: prodName.value,
  templateName: search.value
})

const form = reactive({
  name: ''
})
const formRef = ref(null)
const rules = {
  name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
}

const { page, pageSize, handleCurrentChange, handleSizeChange } = usePage(
  getTemplates,
  {
    filterOptions,
    pageProps: {
      page: 'currentPage'
    }
  }
)

const { hasAuth } = useAuth(authData, prodName)

const columns = computed(() => {
  return hasAuth.value
    ? [
        {
          name: '模板名称',
          key: 'name',
          slot: 'name',
          tooltip: true,
          width: 220
        },
        {
          name: '模板阶段',
          key: 'steps',
          tooltip: true
        },
        {
          name: '类别',
          key: 'type',
          slot: 'type',
          width: 150
        },
        {
          name: '新建人',
          key: 'createUser',
          width: 130
        },
        {
          name: '新建时间',
          key: 'createTime',
          slot: 'createTime',
          width: 130
        },
        {
          name: '操作',
          key: 'action',
          slot: 'action',
          width: 150
        }
      ]
    : [
        {
          name: '模板名称',
          key: 'name',
          slot: 'name',
          tooltip: true,
          width: 220
        },
        {
          name: '模板阶段',
          key: 'steps',
          tooltip: true
        },
        {
          name: '类别',
          key: 'type',
          slot: 'type',
          width: 150
        },
        {
          name: '新建人',
          key: 'createUser',
          width: 130
        },
        {
          name: '新建时间',
          key: 'createTime',
          slot: 'createTime',
          width: 130
        }
      ]
})

watch(
  prodName,
  (name) => {
    if (name) {
      filterOptions.prodName = name
      getTemplates({ ...filterOptions })
    }
  },
  { immediate: true }
)

function getTemplates(params) {
  loading.value = true
  getList({
    currentPage: page.value,
    pageSize: pageSize.value,
    ...params
  })
    .then((res) => {
      const data = res?.data
      templates.value = data?.list ?? []
      total.value = data?.totalCount ?? 0
      authData.value = res?.rightData
    })
    .finally(() => {
      loading.value = false
    })
}

const handleSearch = debounce((val) => {
  filterOptions.templateName = val
  getTemplates(filterOptions)
}, 500)

function handleCopy(id) {
  copyTemplate(id).then(() => {
    Message.success('复制成功')
  })
}

function handleDel(id) {
  confirm('确认删除?')
    .then(() => {
      deleteTemplate(id, OperateLevel.TEMPLATE).then(() => {
        Message.success('删除成功')
      })
    })
    .catch(() => {})
}

function handleCreate() {
  createVisible.value = true
}

function handleCancel() {
  createVisible.value = false
}

const confirmLoading = ref(false)

function handleConfirm() {
  formRef.value.validate((valid) => {
    confirmLoading.value = true
    if (valid) {
      createTemplate(prodName, form.name)
        .then((res) => {
          createVisible.value = false
          router.push({
            name: 'TemplateDetails',
            params: { id: res?.data }
          })
        })
        .finally(() => {
          confirmLoading.value = false
        })
    }
  })
}
</script>

<style lang="scss" scoped>
.template-list {
  .icon-create {
    font-size: 13px;
    font-weight: 600;
  }
}
</style>
