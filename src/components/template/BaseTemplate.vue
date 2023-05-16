<!--
  基础模板类型
-->
<template>
  <div class="base-template">
    <div v-for="(c, index) in data" :key="index" class="tpl-category">
      <div class="category-name">{{ c.nodeName }}</div>
      <div class="stages">
        <div v-for="(s, sindex) in c.stepList" :key="sindex" class="stage-item">
          <div class="stage-info">
            <span v-if="s.step?.nodeStepName" class="stage-name">
              {{ s.step?.nodeStepName }}
            </span>
            <span v-else class="stage-add">
              <span>添加阶段</span>
              <i
                class="iconfont icon-icon-16-bianji btn-edit"
                @click="handleStageAdd"
              />
            </span>
            <el-dropdown
              trigger="click"
              :visible-arrow="false"
              @click.native.stop
              @command="(event) => handleStageCommand(event, s)"
            >
              <i class="iconfont icon-icon-48-gengduo btn-more" />
              <el-dropdown-menu slot="dropdown" class="base-template-dropdown">
                <el-dropdown-item command="rename">重命名</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
                <el-dropdown-item command="addTask">添加任务</el-dropdown-item>
                <el-dropdown-item command="addStage">添加阶段</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="tasks">
            <div
              v-for="(t, tindex) in s.attrList"
              :key="tindex"
              class="task-item"
            >
              <span>{{ t.nodeStepAttrName }}</span>
              <el-dropdown
                trigger="click"
                :visible-arrow="false"
                @click.native.stop
                @command="(event) => handleTaskCommand(event, t, s)"
              >
                <i class="iconfont icon-icon-48-gengduo btn-more" />
                <el-dropdown-menu
                  slot="dropdown"
                  class="base-template-dropdown"
                >
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="task-item__add">
              <div class="btn-add" @click="() => handleTaskAdd(s)">
                <i class="iconfont icon-icon-16-tianjia icon-add" />
                <span>添加任务</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建/编辑阶段 -->
    <BaseDialog
      v-model="stageDialogState.visible"
      :title="stageDialogState.title"
      :body-padding="dialogPadding"
    >
      <el-form ref="stageForm" :model="stage" label-position="top">
        <el-form-item
          label="名称"
          prop="stepName"
          :rules="[
            { required: true, message: '请输入阶段名称', trigger: 'blur' }
          ]"
        >
          <el-input v-model="stage.stepName" placeholder="请输入阶段名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="mini" @click="handleStageCancel">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="stageDialogState.saveLoading"
          @click="handleStageConfirm"
        >
          确认
        </el-button>
      </template>
    </BaseDialog>
    <!-- 添加/编辑任务-->
    <BaseDialog
      v-model="taskDialogState.visible"
      :title="taskDialogState.title"
      body-padding="0"
      custom-class="template-task-dialog"
    >
      <el-input
        v-model="task.attrName"
        placeholder="请输入任务名称"
        class="task-name"
        :class="{ 'error-input': errorFields?.attrName?.length }"
        @blur="handleNameBlur"
      />
      <div v-if="errorFields?.attrName?.length" class="error-name">
        {{ errorFields.attrName[0].message }}
      </div>
      <div class="task-form-item">
        <div class="item-label">
          任务类型
          <span class="required-tag">*</span>
        </div>
        <div class="item-input">
          <el-select v-model="task.core" placeholder="请选择" size="mini">
            <el-option
              v-for="t in taskTypes"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </div>
      </div>
      <template #footer>
        <el-button size="mini" @click="handleTaskCancel">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="taskDialogState.saveLoading"
          @click="handleTaskConfirm"
        >
          确认
        </el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAsyncValidator } from '@vueuse/integrations/useAsyncValidator'
import BaseDialog from '@/components/common/BaseDialog.vue'
import {
  createStage,
  renameNode,
  deleteNode,
  createTask
} from '@/request/apis/template.api'
import { NodeType } from '@/constants/template.const'
import { Message, confirm } from '@/utils'

defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['stage-update', 'task-update'])

const dialogPadding = '0 24px 0 24px'

const stageDialogState = reactive({
  visible: false,
  title: '新建阶段',
  saveLoading: false
})
const stage = reactive({
  fromStepId: 0,
  stepName: ''
})
const stageForm = ref(null)

function handleStageAdd() {
  addStage()
}

function addStage() {
  stageDialogState.title = '新建阶段'
  stage.fromStepId = ''
  stage.stepName = ''
  stageDialogState.visible = true
}

function handleStageCancel() {
  stageDialogState.visible = false
}

function handleStageConfirm() {
  stageForm.value.validate((valid) => {
    if (valid) {
      stageDialogState.saveLoading = true
      if (stage.fromStepId) {
        renameNode(NodeType.STAGE, stage.fromStepId, stage.stepName)
          .then(() => {
            Message.success('更新成功')
            stageDialogState.visible = false
          })
          .finally(() => {
            stageDialogState.saveLoading = false
          })
      } else {
        createStage(stage)
          .then(() => {
            Message.success('创建成功')
            stageDialogState.visible = false
          })
          .finally(() => {
            stageDialogState.saveLoading = false
          })
      }
    }
  })
}

const taskDialogState = reactive({
  visible: false,
  title: '新建任务',
  saveLoading: false
})
const task = reactive({
  stepId: 0,
  id: 0,
  attrName: '',
  core: 0
})
const taskRules = {
  attrName: [{ required: true, message: '请输入任务名称' }],
  core: [{ required: true, message: '请选择任务类型' }]
}
const taskTypes = [
  {
    label: '非核心',
    value: 0
  },
  {
    label: '核心',
    value: 1
  }
]
const { pass, execute, errorFields } = useAsyncValidator(task, taskRules, {
  immediate: false,
  manual: true
})

async function handleNameBlur() {
  await execute()
}

function handleTaskAdd(s) {
  task.stepId = s.step.id
  task.id = ''
  task.attrName = ''
  taskDialogState.visible = true
}

function handleTaskCancel() {
  taskDialogState.visible = false
}

async function handleTaskConfirm() {
  await execute()
  if (pass.value) {
    taskDialogState.saveLoading = true
    if (task.id) {
      renameNode(NodeType.TASK, task.id, task.attrName)
        .then(() => {
          Message.success('更新成功')
          taskDialogState.visible = false
        })
        .finally(() => {
          taskDialogState.saveLoading = false
        })
    } else {
      createTask(task.stepId, task.attrName)
        .then(() => {
          Message.success('创建成功')
          taskDialogState.visible = false
        })
        .finally(() => {
          taskDialogState.saveLoading = false
        })
    }
  }
}

/**
 * 阶段操作菜单事件
 * @param {string} command
 */
function handleStageCommand(command, s) {
  const stepId = s.step.id
  const stepName = s.step.nodeStepName
  emit('stage-update', command)
  if (command === 'rename') {
    stageDialogState.title = '重命名阶段'
    stage.fromStepId = stepId
    stage.stepName = stepName
    stageDialogState.visible = true
  } else if (command === 'del') {
    confirm('确认删除当前阶段？')
      .then(() => {
        deleteNode(stepId, NodeType.STAGE).then(() => {
          Message.success('删除成功')
        })
      })
      .catch(() => {})
  } else if (command === 'addTask') {
    taskDialogState.title = '添加任务'
    taskDialogState.visible = true
  } else if (command === 'addStage') {
    addStage()
  }
}

/**
 * 任务操作按钮
 * @param {string} command
 */
function handleTaskCommand(command, t, s) {
  const stepId = s.step.id
  const taskId = t.id
  emit('task-update', command)
  if (command === 'edit') {
    task.stepId = stepId
    task.id = taskId
    task.attrName = t.nodeStepAttrName
    taskDialogState.title = '编辑任务'
    taskDialogState.visible = true
  } else if (command === 'del') {
    confirm('确认删除当前任务？')
      .then(() => {
        deleteNode(taskId, NodeType.TASK).then(() => {
          Message.success('删除成功')
        })
      })
      .catch(() => {})
  }
}
</script>

<style lang="scss">
.base-template-dropdown {
  &.el-dropdown-menu {
    .popper__arrow {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
$base-border-color: rgba(202, 210, 221, 1);

.template-task-dialog {
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

  .task-form-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: $base-gap * 4;

    .item-label {
      margin: $base-gap * 3 0;

      .required-tag {
        color: $required-color;
      }
    }
  }
}

.base-template {
  display: flex;
  align-items: flex-start;
  padding: $base-gap * 4 0;

  .tpl-category {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    min-width: 280px;

    .category-name {
      flex: 1 0 auto;
      font-size: 16px;
      font-weight: 500;
      background-color: rgba(21, 100, 255, 0.04);
      padding: $base-gap * 2 $base-gap * 5 $base-gap * 2 $base-gap * 5;
      border: 1px solid $base-border-color;
      border-right: 0;
      box-sizing: content-box;
    }

    .stages {
      display: flex;
      align-items: flex-start;
      flex: 1 0 auto;

      .stage-item {
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
        min-width: 280px;

        .stage-info {
          padding: $base-gap * 4 $base-gap $base-gap * 4 $base-gap * 4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1 0 auto;
          height: 54px;

          .stage-name {
            font-size: 16px;
            font-weight: 500;
          }

          .stage-add {
            font-size: 14px;
            color: #a8acb3;
            cursor: pointer;

            .btn-edit {
              color: $font-color;
              margin-left: $base-gap * 2;
            }
          }
        }

        .btn-more {
          display: block;
          transform: rotate(90deg);
          cursor: pointer;
        }

        .tasks {
          display: flex;
          flex-direction: column;
          flex: 1 0 auto;
          border-right: 1px solid $base-border-color;
          background-color: #e4e7ed;
          padding: $base-gap * 4 $base-gap * 2;

          .task-item {
            padding: $base-gap * 4 $base-gap $base-gap * 4 $base-gap * 4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 1 0 auto;
            background-color: #fff;
            margin: $base-gap * 2 0;
            font-size: 16px;
            font-weight: 650;
          }

          .task-item__add {
            padding: $base-gap * 4 $base-gap $base-gap * 4 $base-gap;
            min-width: 230px;

            .btn-add {
              flex: 1 0 auto;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px dashed $border-color;
              font-size: 14px;
              color: $font-color;
              padding: $base-gap 0;
              cursor: pointer;
              height: 32px;
              background-color: #fff;

              .icon-add {
                font-size: 10px;
                font-weight: 500;
                margin-right: $base-gap;
              }
            }
          }
        }
      }
    }
  }
}
</style>
