<template>
  <BaseDialog
    v-model="visible"
    :title="title"
    custom-class="task-form-dialog"
    :append-to-body="true"
    body-padding="0"
    @close="handleClose"
  >
    <el-input
      v-model="form.nodeAttrName"
      placeholder="请输入任务名称"
      class="task-name"
      :class="{ 'error-input': errorFields?.nodeAttrName?.length }"
      :disabled="readonly"
      @blur="handleNameBlur"
    />
    <div v-if="errorFields?.nodeAttrName?.length" class="error-name">
      {{ errorFields.nodeAttrName[0].message }}
    </div>
    <el-form
      ref="formRef"
      v-loading="loading"
      :model="form"
      label-position="top"
      size="mini"
      :disabled="readonly"
      :rules="rules"
    >
      <el-row v-bind="rowProps">
        <el-col :span="colSpan">
          <el-form-item label="任务类型" prop="core">
            <el-select
              v-model="form.core"
              placeholder="请选择"
              class="form-item__input"
            >
              <el-option
                v-for="t in initialForm.coreOptions"
                :key="t.code"
                :label="t.msg"
                :value="t.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="执行人">
            <EePersonInput
              v-model="form.operater"
              :options="initialForm.operaterOptions"
              :data-prop="{ nickName: 'msg', userName: 'code' }"
              class="form-item__input"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-bind="rowProps">
        <el-col :span="colSpan">
          <el-form-item label="开始时间">
            <el-date-picker v-model="form.startTime" v-bind="datetimeProps" />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="截止时间">
            <el-date-picker v-model="form.endTime" v-bind="datetimeProps" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-bind="rowProps">
        <el-col :span="colSpan">
          <el-form-item class="form-item__notice">
            <span>到期提醒</span>
            <el-select
              v-model="form.startNoticeTime"
              placeholder="请选择"
              class="notice-item"
            >
              <el-option
                v-for="t in NOTICE_TYPES"
                :key="t.value"
                :label="t.label"
                :value="t.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item class="form-item__notice">
            <span>到期提醒</span>
            <el-select v-model="form.endNoticeTime" placeholder="请选择">
              <el-option
                v-for="t in NOTICE_TYPES"
                :key="t.value"
                :label="t.label"
                :value="t.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-bind="rowProps">
        <el-col :span="colSpan">
          <el-form-item label="状态">
            <el-select
              v-model="form.status"
              placeholder="请选择"
              class="form-item__input"
            >
              <el-option
                v-for="s in initialForm.statusOptions"
                :key="s.code"
                :label="s.msg"
                :value="s.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="标签">
            <TagSelect
              v-model="form.tagId"
              class="form-item__input"
              :options="initialForm.tagIdOptions"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="关联流水线">
        <el-select
          v-model="form.flowIds"
          placeholder="请选择"
          multiple
          value-key="flowId"
          style="width: 100%"
        >
          <el-option
            v-for="f in flows"
            :key="f.flowId"
            :label="f.flowName"
            :value="f"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="清单">
        <div class="item-todos">
          <div v-for="(t, index) in form.todo" :key="index" class="todo-item">
            <el-checkbox
              v-model="t.status"
              :true-label="TodoStatus.DONE"
              :false-label="TodoStatus.UNDONE"
            />
            <el-input
              v-model="t.content"
              class="todo-item__content"
              :class="{ 'content-done': isTodoDone(t.status) }"
              placeholder="请输入内容"
            />
            <i
              class="iconfont icon-icon-16-shanchu todo-item__remove"
              @click="() => handleRemoveTodo(index)"
            />
          </div>
          <div>
            <el-button
              plain
              icon="iconfont icon-icon-16-tianjia1"
              class="btn-add"
              @click="handleAddTodo"
            >
              添加
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="mini" @click="handleCancel">取消</el-button>
      <el-button
        v-if="!readonly"
        type="primary"
        size="mini"
        :loading="saveLoading"
        @click="handleSave"
      >
        保存
      </el-button>
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed, ref, watch, reactive, toRef } from 'vue'
import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator'
import BaseDialog from '@/components/common/BaseDialog.vue'
import EePersonInput from '@/components/common/EePersonInput.vue'
import TagSelect from '@/components/common/TagSelect.vue'
import {
  PlanStatus,
  NoticeType,
  NOTICE_TYPES,
  TodoStatus,
  FieldType
} from '@/constants/plan.const'
import { initOrFetchTask, savePlanTask } from '@/request/apis/plan.api'
import { Message } from '@/utils'
import { usePlanStore } from '@/stores'
import { useDialog } from '@/hooks/use-dialog'

const props = defineProps({
  value: {
    type: Boolean
  },
  readonly: {
    type: Boolean
  },
  planId: {
    type: [String, Number]
  },
  categoryId: {
    type: [String, Number]
  },
  stageId: {
    type: [String, Number]
  },
  taskId: {
    type: [String, Number]
  }
})
const emit = defineEmits(['input', 'close'])

const { visible, handleClose, handleCancel, close } = useDialog(
  toRef(props, 'value'),
  emit
)

const planStore = usePlanStore()

const isNew = computed(() => !props.taskId)
const title = computed(() => (isNew.value ? '任务新增' : '任务编辑'))

const flows = computed(() => planStore.flows)

// 任务类型（是否核心）
const IsCore = Object.freeze({
  YES: 1,
  NO: 0
})

const rowProps = {
  type: 'flex',
  justify: 'space-between'
}
const datetimeProps = {
  type: 'datetime',
  format: 'yyyy-MM-dd HH:mm',
  valueFormat: 'yyyy-MM-dd HH:mm:ss',
  class: 'form-item__input'
}
const colSpan = 11
const form = reactive({
  nodeStepAttrId: '',
  nodeAttrName: '', // 任务名称
  core: IsCore.NO, // 任务类型
  operater: [],
  startTime: '',
  endTime: '',
  startNoticeTime: NoticeType.NONE,
  endNoticeTime: NoticeType.NONE,
  status: PlanStatus.INIT,
  tagId: [],
  flowIds: [],
  todo: [],
  remark: ''
})
const formRef = ref(null)
const initialForm = ref({})
const rules = {
  core: [
    { required: true, message: '请选择任务类型', trigger: ['blur', 'change'] }
  ]
}
const nameRules = {
  nodeAttrName: {
    type: 'string',
    required: true,
    message: '请输入任务名称'
  }
}
const { pass, execute, errorFields } = useAsyncValidator(form, nameRules, {
  immediate: false,
  manual: true
})
const taskParams = computed(() => ({
  scheduleId: props.planId,
  nodeId: props.categoryId,
  nodeStepId: props.stageId,
  nodeStepAttrId: props.taskId || ''
}))
const loading = ref(false)

watch(
  () => props.value,
  (val) => {
    if (val) {
      loading.value = true
      initOrFetchTask(taskParams.value)
        .then((res) => {
          initialForm.value = processTaskData(res?.data)
          initForm()
        })
        .finally(() => {
          loading.value = false
        })
    }
  }
)

function initForm() {
  const obj = initialForm.value
  Object.keys(form).forEach((key) => {
    form[key] = obj[key]
  })
}

function processTaskData(task, cols = ['status', 'tagId', 'core', 'operater']) {
  const colMap = cols.reduce((ret, col) => {
    ret[col] = true
    return ret
  }, {})
  return Object.keys(task)?.reduce((ret, key) => {
    if (colMap[key] && typeof task[key] === 'object') {
      const prop = task[key]
      if (prop.type === FieldType.MULTIPLE_SELECT) {
        // 多选
        ret[`${key}Options`] = prop.list ?? []
        ret[key] = prop.original ?? []
      } else if (prop.type === FieldType.SINGLE_SELECT) {
        // 单选
        ret[`${key}Options`] = prop.list ?? []
        ret[key] = prop.original[0] ?? ''
      }
    } else {
      // 因为返回类型问题，需要单独处理
      if (key === 'flowIds') {
        ret[key] = task[key] ? JSON.parse(task[key]) : []
      } else {
        ret[key] = task[key]
      }
    }
    return ret
  }, {})
}

const saveLoading = ref(false)

async function handleNameBlur() {
  await execute()
}

async function handleSave() {
  // Validate task name
  await execute()
  formRef.value.validate((valid) => {
    if (valid && pass.value) {
      saveLoading.value = true
      const operators = form.operater
        ?.map((x) => x.code || x.userName)
        .join(',')
      const tagIds = form.tagId?.join(',')
      const flowIds =
        form.flowIds?.length > 0 ? JSON.stringify(form.flowIds) : ''

      savePlanTask({
        scheduleId: props.planId,
        nodeId: props.categoryId,
        nodeStepId: props.stageId,
        ...form,
        operater: operators,
        tagId: tagIds,
        flowIds
      })
        .then(() => {
          Message.success(isNew.value ? '新增成功' : '编辑成功')
          close(true)
        })
        .finally(() => {
          saveLoading.value = false
        })
    }
  })
}

function handleAddTodo() {
  form.todo.push({
    status: TodoStatus.UNDONE,
    content: ''
  })
}

function handleRemoveTodo(index) {
  form.todo.splice(index, 1)
}

function isTodoDone(status) {
  return status === TodoStatus.DONE
}
</script>

<style lang="scss" scoped>
.task-form-dialog {
  .task-name {
    margin: $base-gap * 2 0;

    &.error-input {
      :deep(.el-input__inner) {
        border-bottom-color: $required-color;
        border-top-color: $required-color;
      }
    }

    :deep(.el-input__inner) {
      border-left: none;
      border-right: none;
      border-radius: 0;
    }
  }

  .error-name {
    color: $required-color;
    margin-left: $base-gap * 4;
  }

  .el-form {
    padding: 0 $base-gap * 6 $base-gap * 6 $base-gap * 6;

    .form-item__input {
      width: 100%;
    }

    .form-item__notice {
      :deep(.el-form-item__content) {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &::before {
          display: none;
        }

        .notice-item {
          margin-left: $base-gap * 2;
          flex: 1 0 auto;
        }
      }
    }

    .item-todos {
      .todo-item {
        display: flex;
        align-items: center;
        margin: $base-gap * 4 0;

        &__content {
          margin: 0 $base-gap * 2;

          &.content-done {
            :deep(.el-input__inner) {
              text-decoration: line-through;
            }
          }
        }

        &__remove {
          cursor: pointer;
        }
      }

      .btn-add {
        color: rgb(0, 0, 0, 0.6);
        border-style: dashed;
        border-color: $border-color;
        font-size: 14px;
        width: 220px;

        :deep(.iconfont) {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
