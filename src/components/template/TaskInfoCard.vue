<template>
  <div
    class="task-info-card"
    :class="{
      'task-status__delayed': isDelayed
    }"
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
        v-if="hasAuth"
        trigger="click"
        :visible-arrow="false"
        @click.native.stop
        @command="handleCommand"
      >
        <i class="iconfont icon-icon-48-gengduo btn-more" />
        <el-dropdown-menu slot="dropdown" class="plan-progress-dropdown">
          <el-dropdown-item
            :class="{ disabled: isDone }"
            :disabled="isDone"
            command="del"
          >
            删除
          </el-dropdown-item>
          <el-dropdown-item
            :class="{ disabled: isDone }"
            :disabled="isDone"
            command="add"
          >
            添加任务
          </el-dropdown-item>
          <el-dropdown-item
            :class="{ disabled: isDone }"
            :disabled="isDone"
            command="record"
          >
            历史记录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="task-info">
      <el-form :label-width="`${labelWidth}px`">
        <el-form-item label="截止时间:">
          {{ task.endTime | date('YYYY-MM-DD HH:mm') }}
          <i
            v-if="showNotice()"
            class="iconfont icon-icon-16-yuqi icon-warning"
          />
        </el-form-item>
        <el-form-item label="执行人:">
          {{ getOperatorDisplay() }}
        </el-form-item>
        <el-form-item label="当前状态:">
          <span class="task-status" :style="statusStyle">
            {{ task.status?.msg || '--' }}
          </span>
        </el-form-item>
        <el-form-item v-if="showTodo()" label="清单:">
          <span class="todo-status__count">
            {{ getTodoCountText() }}
          </span>
        </el-form-item>
        <el-form-item v-if="showTodo()">
          <div class="form-item__todos">
            <div
              v-for="(td, tindex) in getTodos()"
              :key="tindex"
              :class="{
                'todo-status__done': td.status === TodoStatus.DONE
              }"
            >
              {{ td.content }}
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TodoStatus, IsDelayed } from '@/constants/plan.const'

const props = defineProps({
  task: {
    type: Object,
    required: true,
    default: () => ({})
  },
  labelWidth: {
    type: Number,
    default: 65
  }
})
const emit = defineEmits(['click', 'menu-select'])

const statusStyle = computed(() => {
  return {
    backgroundColor:
      props.task?.status?.color.indexOf('#') !== -1
        ? props.task?.status?.color
        : '#' + props.task?.status?.color
  }
})

const isDelayed = computed(() => props.task.isDelay.code === IsDelayed.YES)

function handleCommand(command) {
  emit('menu-select', command)
}

function getOperatorDisplay() {
  return props.task.operater.map((o) => o.msg).join('、') || '--'
}

function showNotice() {
  return props.task.startNoticeTime?.index || props.task.endNoticeTime?.index
}

function showTodo() {
  if (!props.task.todo || JSON.parse(props.task.todo)?.length === 0) {
    return false
  }

  return true
}

function getTodos() {
  return props.task.todo ? JSON.parse(props.task.todo) : []
}

function getTodoCountText() {
  const todoStr = props.task.todo
  if (!todoStr) {
    return '0/0'
  }
  const todos = JSON.parse(todoStr)
  const doneTodos = todos.filter((t) => t.status === TodoStatus.DONE)
  return `${doneTodos.length}/${todos.length}`
}
</script>

<style lang="scss" scoped>
$border-color: rgba(202, 210, 221, 1);

.task-info-card {
  display: flex;
  flex-direction: column;
  padding: $base-gap * 4;
  cursor: pointer;
  flex: 1 0 230px;

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
        padding: $base-gap / 2 $base-gap * 2;
        font-size: 12px;
      }

      .task-name__text {
        display: inline-block;
        max-width: 150;
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
          border-left: 1px solid $border-color;
          padding-left: $base-gap * 3;

          .todo-status__done {
            color: $border-color;
            text-decoration: line-through;
          }
        }
      }
    }
  }
}
</style>
