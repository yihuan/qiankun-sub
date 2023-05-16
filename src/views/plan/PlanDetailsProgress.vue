<template>
  <div v-loading="loading" class="plan-details-progress">
    <div v-for="c in data" :key="c.nodeId" class="progress-item">
      <div class="item-category">
        <p class="category-name">{{ c.nodeName }}</p>
        <p>{{ getTimeText(c) }}</p>
      </div>
      <div class="item-stage">
        <div v-for="s in c.data" :key="s.nodeStepId" class="item-stage__item">
          <div :class="['stage-name', getStageClass(c)]">
            {{ s.nodeStepName }}
          </div>
          <div class="item-task">
            <div v-for="t in s.data" :key="t.id" class="item-task__item">
              <div
                class="task-left"
                :style="{
                  backgroundColor: getStatusColor(t)
                }"
              ></div>
              <div
                class="task-right"
                :class="{
                  'task-status__delayed': isDelayed(t.isDelay)
                }"
                @click="() => handleTaskEdit(t, s, c)"
              >
                <div class="task-name">
                  <div class="task-name__container">
                    <span
                      v-for="tg in t.tag"
                      :key="tg.tagId"
                      class="task-name__tag"
                      :style="{ backgroundColor: tg.tagColor }"
                    >
                      {{ tg.tagName }}
                    </span>
                    <span class="task-name__text ellipsis">
                      {{ t.nodeStepAttrName }}
                    </span>
                  </div>
                  <el-dropdown
                    trigger="click"
                    :visible-arrow="false"
                    @click.native.stop
                    @command="(event) => handleCommand(event, t, s, c)"
                  >
                    <i class="iconfont icon-icon-48-gengduo btn-more" />
                    <el-dropdown-menu
                      slot="dropdown"
                      class="plan-progress-dropdown"
                    >
                      <el-dropdown-item
                        :class="{ disabled: menuDisabled }"
                        :disabled="menuDisabled"
                        command="del"
                      >
                        删除
                      </el-dropdown-item>
                      <el-dropdown-item
                        :class="{ disabled: menuDisabled }"
                        :disabled="menuDisabled"
                        command="add"
                      >
                        添加任务
                      </el-dropdown-item>
                      <el-dropdown-item command="record">
                        历史记录
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="task-info">
                  <el-form label-width="65px">
                    <el-form-item label="截止时间:">
                      {{ t.endTime | date('YYYY-MM-DD HH:mm') }}
                      <i
                        v-if="showNotice(t)"
                        class="iconfont icon-icon-16-yuqi icon-warning"
                      />
                    </el-form-item>
                    <el-form-item label="执行人:">
                      {{ getOperatorDisplay(t.operater) }}
                    </el-form-item>
                    <el-form-item label="当前状态:">
                      <span
                        class="task-status"
                        :style="{
                          backgroundColor: getStatusColor(t)
                        }"
                      >
                        {{ t.status?.msg || '--' }}
                      </span>
                    </el-form-item>
                    <el-form-item v-if="showTodo(t.todo)" label="清单:">
                      <span class="todo-status__count">
                        {{ getTodoCountText(t.todo) }}
                      </span>
                    </el-form-item>
                    <el-form-item v-if="showTodo(t.todo)">
                      <div class="form-item__todos">
                        <div
                          v-for="(td, tindex) in getTodos(t.todo)"
                          :key="tindex"
                          :class="{
                            'todo-status__done': td.status === TodoStatus.DONE
                          }"
                        >
                          <el-checkbox
                            :class="{
                              'todo-checked': td.status === TodoStatus.DONE,
                              'todo-unchecked': td.status === TodoStatus.UNDONE
                            }"
                            :checked="td.status === TodoStatus.DONE"
                            :disabled="true"
                          />
                          {{ td.content }}
                        </div>
                      </div>
                    </el-form-item>
                    <el-divider v-if="t.flow" class="item-divider" />
                    <el-form-item v-if="t.flow" label="流水线:">
                      <span
                        v-for="f in getFlows(t.flow)"
                        :key="f.flowId"
                        class="flow-item"
                      >
                        <a :href="f.link" target="_blank" @click.stop>
                          &lt;{{ f.flowName }}&gt;
                        </a>
                        <span class="flow-item__divider">、</span>
                      </span>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
            <div
              v-if="s.data?.length === 0"
              class="item-task__item task-item__add"
            >
              <div
                class="btn-add"
                :class="{ disabled: menuDisabled }"
                @click="() => handleTaskAdd(s, c)"
              >
                <i class="iconfont icon-icon-16-tianjia icon-add" />
                <span>添加任务</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <OperationRecords
      v-model="recordVisible"
      :type-id="currentTaskId"
      :type="recordType"
    />
    <TaskFormDialog
      v-model="taskVisible"
      :readonly="isTaskReadonly"
      :plan-id="id"
      :category-id="categoryId"
      :stage-id="stageId"
      :task-id="taskId"
      @close="handleTaskUpdate"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router/composables'
import dayjs from 'dayjs'
import { MutationType } from 'pinia'
import OperationRecords from '@/components/plan/OperationRecords.vue'
import TaskFormDialog from '@/components/plan/TaskFormDialog.vue'
import { formatDate, confirm, Message } from '@/utils'
import { usePlanProgress } from '@/hooks/plan/use-plan-progress'
import { usePlanStore, useAppStore } from '@/stores'
import { IsDelayed, TodoStatus } from '@/constants/plan.const'
import { useAuth } from '@/hooks/use-auth'

const props = defineProps({
  // Handles taskName from url
  taskName: {
    type: String
  }
})

const route = useRoute()
const appStore = useAppStore()
const planStore = usePlanStore()

const id = computed(() => route.params.id)
const recordVisible = ref(false)
const currentTaskId = ref('')
const recordType = ref('plan')
const taskVisible = ref(false)
const taskId = ref(0)
const isTaskReadonly = ref(false)
const categoryId = ref('')
const stageId = ref('')
const currentUser = computed(() => appStore.currentUser)

const {
  loading,
  data,
  isDone,
  authData,
  filterParams,
  getProgress,
  deleteTask
} = usePlanProgress(id)

const prodName = computed(() => appStore.appName)
const { hasAuth } = useAuth(authData, prodName)
const menuDisabled = computed(() => isDone.value || !hasAuth.value)

planStore.$subscribe((mutation, state) => {
  // 首页进来调用，需要过滤器更新完后调用
  if (mutation.type === MutationType.patchObject) {
    filterParams.value = {
      ...filterParams.value,
      ...state.progressActions.filter
    }
    getProgress(props.taskName ? { name: props.taskName } : {})
  } else if (
    mutation.type === MutationType.patchFunction &&
    state.progressActions.records
  ) {
    recordVisible.value = true
    currentTaskId.value = id.value
    recordType.value = 'plan'
  }
})

function handleCommand(command, task, stage, category) {
  if (command === 'del') {
    confirm('确认删除？数据删除后不可恢复')
      .then(() => {
        deleteTask(task.nodeStepAttrId).then(() => {
          Message.success('删除成功')
          getProgress()
        })
      })
      .catch(() => {})
  } else if (command === 'add') {
    taskId.value = 0
    stageId.value = stage.nodeStepId
    categoryId.value = category.nodeId
    taskVisible.value = true
  } else if (command === 'record') {
    recordVisible.value = true
    currentTaskId.value = task.nodeStepAttrId
    recordType.value = 'task'
  }
}

function handleTaskAdd(stage, category) {
  if (menuDisabled.value) return

  stageId.value = stage.nodeStepId
  categoryId.value = category.nodeId
  taskId.value = 0
  taskVisible.value = true
}

function handleTaskEdit(task, stage, category) {
  // 当前用户是否为执行人之一
  const isExecutor = task?.operater?.some(
    (x) => x.code === currentUser.value.id
  )
  // 已完成状态或无权限或非执行人之一为只读
  isTaskReadonly.value = menuDisabled.value && !isExecutor
  taskId.value = task.nodeStepAttrId
  stageId.value = stage.nodeStepId
  categoryId.value = category.nodeId
  taskVisible.value = true
}

function handleTaskUpdate(updated) {
  if (updated) {
    getProgress()
  }
}

function getTimeText(category) {
  const { time, startTime, endTime } = category
  if (time) {
    return formatDate(time, 'YYYY-MM-DD HH:mm')
  } else {
    return `${formatDate(startTime, 'YYYY-MM-DD HH:mm')} 至 ${formatDate(
      endTime,
      'YYYY-MM-DD HH:mm'
    )}`
  }
}

function showTodo(todo) {
  if (!todo || JSON.parse(todo)?.length === 0) {
    return false
  }

  return true
}

function getStageClass(category) {
  const { time, startTime, endTime } = category
  if (isSameOrBeforeToday(time || startTime || endTime)) {
    return 'stage-done'
  } else {
    return 'stage-init'
  }
}

const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)
function isSameOrBeforeToday(date) {
  const today = dayjs()
  return dayjs(date).isSameOrBefore(today, 'day')
}

function getOperatorDisplay(operators) {
  return operators.map((o) => o.msg).join('、') || '--'
}

function showNotice(task) {
  return task.startNoticeTime?.index || task.endNoticeTime?.index
}

function isDelayed(delay) {
  return delay.code === IsDelayed.YES
}

function getStatusColor(task) {
  const { isDelay, status } = task
  if (isDelay?.code === IsDelayed.YES) {
    return isDelay.color
  }
  return status?.color?.indexOf('#') !== -1
    ? status?.color
    : '#' + status?.color
}

function getTodos(todoStr) {
  return todoStr ? JSON.parse(todoStr) : []
}

function getFlows(flowStr) {
  return flowStr ? JSON.parse(flowStr) : []
}

function getTodoCountText(todoStr) {
  if (!todoStr) {
    return '0/0'
  }
  const todos = JSON.parse(todoStr)
  const doneTodos = todos.filter((t) => t.status === TodoStatus.DONE)
  return `${doneTodos.length}/${todos.length}`
}
</script>

<style lang="scss">
.plan-progress-dropdown {
  &.el-dropdown-menu {
    .popper__arrow {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
$pg-border-color: rgba(202, 210, 221, 1);

.plan-details-progress {
  display: flex;
  align-items: flex-start;
  padding: $base-gap * 4 0;

  .progress-item {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;
    min-width: 280px;

    .item-category {
      flex: 1 0 auto;
      font-size: 16px;
      font-weight: 500;
      background-color: rgba(21, 100, 255, 0.04);
      padding: $base-gap * 2 $base-gap * 5 $base-gap $base-gap * 5;
      border: 1px solid $pg-border-color;
      border-right: 0;
      height: 64px;
      box-sizing: content-box;

      .category-name {
        margin-bottom: $base-gap * 2;
      }
    }

    .item-stage {
      display: flex;
      align-items: flex-start;
      flex: 1 0 auto;

      &__item {
        flex: 1 0 auto;

        .stage-name {
          position: relative;
          padding: $base-gap 0;
          text-align: center;
          height: 28px;

          &.stage-init {
            color: #999999;
            background-color: #f2f2f2;
            border-bottom: 1px solid $pg-border-color;

            &::after {
              content: '';
              position: absolute;
              top: 0;
              right: -9px;
              width: 0;
              height: 0;
              border-top: 14px solid transparent;
              border-bottom: 14px solid transparent;
              border-left: 9px solid #f2f2f2;
              z-index: 1;
            }
          }

          &.stage-done {
            color: #fff;
            background-color: $primary-color;

            &::after {
              content: '';
              position: absolute;
              top: 0;
              right: -9px;
              width: 0;
              height: 0;
              border-top: 14px solid transparent;
              border-bottom: 14px solid transparent;
              border-left: 9px solid $primary-color;
              z-index: 1;
            }
          }
        }

        .item-task {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          border-right: 1px solid $pg-border-color;
          margin-top: $base-gap * 2;
          padding: $base-gap * 3;
          background-color: $border-color;

          &__item {
            flex: 1 0 auto;
            margin: $base-gap * 2 0;
            background-color: #fff;
            display: flex;
            align-items: stretch;

            &:first-child {
              margin-top: 0;
            }

            .task-left {
              width: 8px;
            }

            .task-right {
              display: flex;
              flex-direction: column;
              padding: $base-gap * 4;
              cursor: pointer;
              flex: 1 0 auto;
              width: 230px;

              &.task-status__delayed {
                background-color: rgb(236, 128, 131, 0.15);
              }

              .task-name {
                display: flex;
                align-items: center;
                justify-content: space-between;

                &__container {
                  display: flex;
                  align-items: center;

                  .task-name__tag {
                    color: #fff;
                    margin-right: $base-gap;
                    border-radius: 4px;
                    padding: calc($base-gap / 2) $base-gap * 2;
                    font-size: 12px;
                  }

                  .task-name__text {
                    display: inline-block;
                    max-width: 150px;
                    font-size: 16px;
                    font-weight: 650;
                  }
                }

                .btn-more {
                  display: block;
                  transform: rotate(90deg);
                  cursor: pointer;
                }
              }

              .task-info {
                margin-top: $base-gap * 2;

                :deep(.el-form) {
                  .item-divider {
                    margin: $base-gap * 2 0;
                  }

                  .el-form-item {
                    margin-bottom: 0;

                    &__label {
                      font-size: 12px;
                      line-height: 28px;
                    }

                    &__content {
                      font-size: 12px;
                      line-height: 28px;
                    }

                    .icon-warning {
                      margin-left: $base-gap * 4;
                      color: $icon-color;
                    }

                    .task-status {
                      display: inline-block;
                      color: #fff;
                      padding: 0 $base-gap * 2;
                      height: 20px;
                      line-height: 20px;
                    }

                    .todo-status__count {
                      padding: $base-gap $base-gap * 2;
                      color: #8f94a1;
                      background-color: #f5f6f8;
                      border-radius: 4px;
                    }

                    .form-item__todos {
                      border-left: 1px solid $pg-border-color;
                      padding-left: $base-gap * 3;

                      .el-checkbox.todo-checked {
                        .el-checkbox__input.is-disabled {
                          .el-checkbox__inner {
                            color: #fff;
                            cursor: default;
                            background-color: rgb(80, 169, 68);
                            border-color: rgb(80, 169, 68);
                          }
                        }
                      }

                      .todo-status__done {
                        color: $pg-border-color;
                        text-decoration: line-through;
                      }
                    }

                    .flow-item {
                      margin-right: $base-gap;

                      &:last-child {
                        .flow-item__divider {
                          display: none;
                        }
                      }
                    }
                  }
                }
              }
            }

            &.task-item__add {
              margin: 0;
              padding: 0;
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
                height: 26px;

                .icon-add {
                  font-size: 10px;
                  font-weight: 500;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
