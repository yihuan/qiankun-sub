<template>
  <BaseDialog
    v-model="visible"
    :title="title"
    custom-class="plan-form-dialog"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      size="mini"
    >
      <el-row v-bind="rowProps">
        <el-col :span="colSpan">
          <el-form-item prop="versionNo" class="hide-asterisk">
            <template #label>
              <div class="version-label">
                <span>
                  版本号
                  <span class="required-icon">*</span>
                </span>
                <div>
                  <span class="switch-text">临时版本</span>
                  <el-switch
                    v-model="form.isTemporary"
                    :active-value="IsTemporary.YES"
                    :inactive-value="IsTemporary.NO"
                  />
                </div>
              </div>
            </template>
            <el-input
              v-model="form.versionNo"
              class="item-content"
              placeholder="版本号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="关联模板" prop="templateId">
            <el-select
              v-model="form.templateId"
              class="item-content"
              placeholder="请选择关联模板"
              :disabled="!isNew"
            >
              <el-option
                v-for="t in templates"
                :key="t.id"
                :label="t.name"
                :value="t.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-bind="rowProps">
        <el-col :span="colSpan">
          <el-form-item label="版本开始时间">
            <el-date-picker
              v-model="form.versionStartTime"
              placeholder="版本开始时间"
              v-bind="datetimeProps"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="server 上线时间">
            <el-date-picker
              v-model="form.serverOnlineTime"
              placeholder="server 上线时间"
              v-bind="datetimeProps"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-bind="rowProps">
        <el-col :span="colSpan">
          <el-form-item label="native 上线时间">
            <el-date-picker
              v-model="form.nativeOnlineTime"
              placeholder="native 上线时间"
              v-bind="datetimeProps"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="集成测试开始时间">
            <el-date-picker
              v-model="form.integrationStartTime"
              placeholder="集成测试开始时间"
              v-bind="datetimeProps"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-bind="rowProps">
        <el-col :span="colSpan">
          <el-form-item label="灰度发布时间">
            <el-date-picker
              v-model="form.grayPublishTime"
              placeholder="灰度发布时间"
              v-bind="datetimeProps"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="iOS 提审">
            <el-date-picker
              v-model="form.iosSubmitTime"
              placeholder="iOS 提审"
              v-bind="datetimeProps"
              :picker-options="pickerOptions"
              @change="handleIosSubmitChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-bind="rowProps">
        <el-col :span="colSpan">
          <el-form-item label="Android 发版">
            <el-date-picker
              v-model="form.androidPublishTime"
              placeholder="Android 发版"
              v-bind="datetimeProps"
              :picker-options="pickerOptions"
              @change="handleAndroidPublishChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="colSpan">
          <el-form-item label="版本间隔" prop="publishCycle">
            <el-input
              v-model="form.publishCycle"
              placeholder="版本间隔（天）"
              class="item-content"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="关联迭代">
        <el-select
          v-model="form.iterationId"
          style="width: 100%"
          placeholder="关联迭代"
          filterable
          multiple
          remote
          :remote-method="remoteMethod"
        >
          <el-option
            v-for="it in iterations"
            :key="it.id"
            :label="it.title"
            :value="it.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="版本延期" prop="delayReason" class="hide-asterisk">
        <template #label>
          <el-checkbox
            v-model="form.isDelay"
            :true-label="IsDelayed.YES"
            :false-label="IsDelayed.NO"
            @change="handleDelayChange"
          >
            延期
          </el-checkbox>
        </template>
        <el-input
          v-if="form.isDelay === IsDelayed.YES"
          v-model="form.delayReason"
          type="textarea"
          :rows="3"
          placeholder="请输入延期原因"
          @blur="validateDelayReason"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="mini" @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        :loading="confirmLoading"
        size="mini"
        @click="handleConfirm"
      >
        确定
      </el-button>
    </template>
  </BaseDialog>
</template>

<script setup>
import { computed, ref, watch, toRef } from 'vue'
import dayjs from 'dayjs'
import BaseDialog from '@/components/common/BaseDialog.vue'
import { IsDelayed, IsTemporary } from '@/constants/plan.const'
import { usePlanStore, useAppStore } from '@/stores'
import {
  getIterationList,
  createPlan,
  updatePlan,
  getLastVersionInterval
} from '@/request/apis/plan.api'
import { Message } from '@/utils'
import { useDialog } from '@/hooks/use-dialog'

const props = defineProps({
  value: {
    type: Boolean
  },
  plan: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['input', 'close', 'update'])

const { visible, handleClose, close, handleCancel } = useDialog(
  toRef(props, 'value'),
  emit
)

const appStore = useAppStore()
const planStore = usePlanStore()

const prodName = computed(() => appStore.appName)
const confirmLoading = ref(false)

const colSpan = 11
const rowProps = {
  type: 'flex',
  justify: 'space-between'
}
const datetimeProps = {
  format: 'yyyy-MM-dd HH:mm',
  valueFormat: 'yyyy-MM-dd HH:mm:ss',
  class: 'item-content',
  type: 'datetime'
}

function initFormData() {
  return {
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
    iterationId: [],
    isDelay: 0,
    delayReason: ''
  }
}

const formRef = ref(null)
const form = ref(initFormData())
const isDelayed = computed(() => form.value.isDelay === IsDelayed.YES)

const versionRe = new RegExp('^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$')
const versionValidator = (rule, value, cb) => {
  if (!value) {
    cb(new Error('请输入版本号'))
  } else if (!versionRe.test(value)) {
    cb(new Error('请输入正确三位版本号'))
  } else {
    cb()
  }
}
const rules = computed(() => {
  return isDelayed.value
    ? {
        versionNo: [
          {
            validator: versionValidator,
            trigger: ['blur']
          }
        ],
        publishCycle: [
          {
            required: true,
            message: '请输入版本间隔',
            trigger: ['blur']
          }
        ],
        templateId: [
          {
            required: true,
            message: '请选择关联模板',
            trigger: ['blur', 'change']
          }
        ],
        delayReason: [
          {
            required: true,
            message: '请输入延期原因',
            trigger: ['blur']
          }
        ]
      }
    : {
        versionNo: [
          {
            validator: versionValidator,
            trigger: ['blur']
          }
        ],
        publishCycle: [
          {
            required: true,
            message: '请输入版本间隔',
            trigger: ['blur']
          }
        ],
        templateId: [
          {
            required: true,
            message: '请选择关联模板',
            trigger: ['blur', 'change']
          }
        ]
      }
})
const pickerOptions = computed(() => ({
  disabledDate: (current) => {
    const versionStartTime = form.value.versionStartTime
    if (!versionStartTime) {
      return true
    }
    return current.getTime() <= new Date(versionStartTime).getTime()
  }
}))
const isNew = computed(() => !props.plan?.id)
const title = computed(() => {
  return isNew.value ? '新建版本计划' : '编辑版本计划'
})

const defaultTemplateId = computed(() => planStore.template.defaultId)
const templates = computed(() => planStore.template.list)
const iterations = ref([])

watch(
  () => props.value,
  () => {
    if (isNew.value) {
      form.value = initFormData()
      form.value.templateId = defaultTemplateId.value
      iterations.value = planStore.iterations
    }
  }
)

watch(
  () => props.plan,
  (plan) => {
    if (plan) {
      form.value = {
        ...plan,
        iterationId: plan.iterationId ? plan.iterationId.split(',') : []
      }
      // 编辑时已选择的迭代列表，在 iterationName 里以 JSON 字符串保存
      iterations.value = plan.iterations
    }
  }
)

function handleIosSubmitChange(event) {
  if (isNew.value) {
    if (
      form.value.androidPublishTime &&
      isBefore(event, form.value.androidPublishTime)
    ) {
      getInterval(form.value.androidPublishTime)
    } else {
      getInterval(event)
    }
  }
}

function handleAndroidPublishChange(event) {
  if (isNew.value) {
    if (
      form.value.androidPublishTime &&
      isBefore(event, form.value.androidPublishTime)
    ) {
      getInterval(form.value.androidPublishTime)
    } else {
      getInterval(event)
    }
  }
}

function isBefore(firstDate, secondDate) {
  return dayjs(firstDate).isBefore(secondDate)
}

/**
 * 获取版本间隔天数
 * @param {string} newVersionTime
 */
function getInterval(newVersionTime) {
  getLastVersionInterval(prodName.value, newVersionTime).then((res) => {
    form.value.publishCycle = res?.data ?? ''
  })
}

function remoteMethod(query) {
  if (!query) {
    iterations.value = planStore.iterations
  }
  getIterationList(prodName.value, query).then((res) => {
    iterations.value = res?.data ?? []
  })
}

function handleDelayChange(val) {
  if (val === IsDelayed.NO) {
    clearValidateDelayReason()
  }
}

function validateDelayReason() {
  formRef.value.validateField('delayReason')
}

function clearValidateDelayReason() {
  formRef.value.clearValidate('delayReason')
}

function handleConfirm() {
  if (isDelayed.value) {
    validateDelayReason()
  } else {
    clearValidateDelayReason()
  }
  formRef.value.validate((valid) => {
    if (valid) {
      confirmLoading.value = true
      const iterationId = form.value.iterationId
      if (isNew.value) {
        createPlan({ ...form.value, iterationId: iterationId?.join(',') || '' })
          .then(() => {
            Message.success('创建成功')
            emit('update', true)
            close()
          })
          .finally(() => {
            confirmLoading.value = false
          })
      } else {
        updatePlan({
          ...form.value,
          iterationId: iterationId?.join(',') || ''
        })
          .then(() => {
            emit('update', false)
            Message.success('更新成功')
            close()
          })
          .finally(() => {
            confirmLoading.value = false
          })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.plan-form-dialog {
  .el-form .el-form-item.is-required.hide-asterisk {
    :deep(.el-form-item__label)::after {
      display: none;
    }
  }
  .version-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 250px;

    .required-icon {
      color: $required-color;
    }

    .switch-text {
      margin-right: $base-gap;
    }
  }

  .item-content {
    width: 250px;
  }
}
</style>
