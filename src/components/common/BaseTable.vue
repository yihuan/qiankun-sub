<template>
  <el-table
    v-loading="loading"
    class="base-table"
    :data="tableData"
    :height="height"
    :max-height="maxHeight"
    :stripe="stripe"
    :border="border"
    :show-header="showHeader"
    :row-class-name="rowClassName"
    :row-key="rowKey"
    :lazy="lazy"
    :load="load"
    :default-sort="{
      prop: defaultSort.prop || '',
      order: defaultSort.order ? defaultSort.order + 'ending' : ''
    }"
    @sort-change="sortChange"
    @cell-mouse-enter="handleCellMouseEnter"
    @cell-mouse-leave="handleCellMouseLeave"
  >
    <template #empty>
      <slot name="empty">
        <span class="no-data">
          <img :src="noDataImg" />
          <span>暂无数据</span>
        </span>
      </slot>
    </template>
    <el-table-column v-if="showIndex" type="index" :width="indexWidth" />
    <el-table-column v-if="showExpand" type="expand">
      <template slot-scope="expandProps">
        <slot name="expand" :row="expandProps.row" />
      </template>
    </el-table-column>
    <el-table-column
      v-for="c in tableColumns"
      :key="c.key"
      :sortable="c.sortable ? 'custom' : false"
      :label="c.name"
      :width="c.width"
      :min-width="c.minWidth"
      :show-overflow-tooltip="c.tooltip"
      :align="c.align || 'left'"
      :fixed="c.fixed"
    >
      <template slot="header" slot-scope="scope">
        <template v-if="c.headerSlot">
          <slot
            :name="`${c.key}Header`"
            :row="scope.row"
            :index="scope.$index"
          />
        </template>
        <template v-else>
          {{ c.name }}
        </template>
      </template>
      <!-- 可展开行 -->
      <template v-if="c.type === 'expand'" slot-scope="expandProps">
        <slot :name="`${c.key}Expand`" :row="expandProps.row" />
      </template>
      <template slot-scope="scope">
        <!-- 添加排序图标 -->
        <template v-if="c.key === 'sortable'">
          <i
            :style="{
              visibility: showDragButton(scope.$index) ? 'visible' : 'hidden'
            }"
            class="iconfont icon-icon-24-yidong icon-move"
            :class="[canSort ? '' : 'disabled']"
          />
        </template>
        <!-- 指定了自定义 slot -->
        <template v-else-if="!!c.slot">
          <slot :name="c.slot" :row="scope.row" :index="scope.$index" />
          <span
            v-show="c.showActions && scope.row.showButtons"
            class="btn-actions"
          >
            <slot
              :name="`${c.key}Actions`"
              :row="scope.row"
              :index="scope.$index"
            >
              <i
                class="iconfont icon-icon-16-bianji"
                @click="handleSettings(scope.row)"
              ></i>
              <i
                class="iconfont icon-icon-16-shanchu"
                @click="handleDel(scope.row)"
              ></i>
            </slot>
          </span>
        </template>
        <!-- 普通指定名称列 -->
        <template v-else>
          <div class="ellipsis">{{ scope.row[c.key] || '--' }}</div>
          <span
            v-show="c.showActions && scope.row.showButtons"
            class="btn-actions"
          >
            <slot
              :name="`${c.key}Actions`"
              :row="scope.row"
              :index="scope.$index"
            >
              <i
                class="iconfont icon-icon-16-bianji"
                @click="() => handleSettings(scope.row)"
              ></i>
              <i
                class="iconfont icon-icon-16-shanchu"
                @click="() => handleDel(scope.row)"
              ></i>
            </slot>
          </span>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { computed, ref, watchEffect, nextTick } from 'vue'
import noDataImg from '@/assets/images/no-data.png'
import Sortable from 'sortablejs'

const props = defineProps({
  loading: {
    type: Boolean
  },
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  sortable: {
    type: Boolean
  },
  canSort: {
    type: Boolean,
    default: true
  },
  notDraggableIndices: {
    type: Array,
    default: () => []
  },
  height: {
    type: [String, Number]
  },
  maxHeight: {
    type: [String, Number]
  },
  stripe: {
    type: Boolean
  },
  border: {
    type: Boolean
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  rowClassName: {
    type: [Function, String]
  },
  rowKey: {
    type: [Function, String]
  },
  defaultSort: {
    type: Object,
    default: () => {
      return {
        prop: '',
        order: ''
      }
    }
  },
  lazy: {
    type: Boolean,
    default: false
  },
  load: {
    type: Function
  },
  showIndex: {
    type: Boolean
  },
  indexWidth: {
    type: Number,
    default: 50
  },
  showExpand: {
    type: Boolean
  }
})
const emit = defineEmits([
  'setting',
  'del',
  'cell-mouse-enter',
  'cell-mouse-leave',
  'drag-update',
  'sortChange',
  'sort-update'
])

const list = ref(props.data)

const sortChange = (event) => {
  // TODO 这里不知道为啥取不到prop,暂时遍历取一下
  let targetColumn = props.columns.find((it) => it.name === event.column.label)
  emit('sortChange', {
    prop: targetColumn.key,
    order: event.order?.replace('ending', '') || ''
  })
}
const showButtons = computed(() => !!props.columns.find((x) => x.showActions))
const tableColumns = computed(() => {
  return props.sortable
    ? [
        {
          name: '',
          key: 'sortable',
          width: '30px'
        }
      ].concat(props.columns)
    : props.columns
})
const tableData = computed(() => {
  return showButtons.value
    ? props.data?.map((x) => ({ ...x, showButtons: false }))
    : props.data
})
const draggableSelectors = computed(() => {
  return new Array(props.data.length)
    .fill(1)
    .reduce((ret, curr, index) => {
      if (showDragButton(index)) {
        ret += `, .el-table__row:nth-child(${index + 1})`
      }
      return ret
    }, '')
    ?.substring(1)
})

watchEffect(() => {
  if (draggableSelectors.value?.length && props.canSort) {
    list.value = [...props.data]

    nextTick(() => {
      dragNDrop()
    })
  }
})

function dragNDrop() {
  const tbody = document.querySelector('.base-table .el-table__body tbody')
  Sortable.create(tbody, {
    group: {
      name: 'field',
      pull: true,
      put: true
    },
    animation: 150,
    easing: 'cubic-bezier(1, 0, 0, 1)',
    draggable: draggableSelectors.value,
    onEnd: ({ oldIndex, newIndex }) => {
      if (oldIndex !== newIndex) {
        const targetRow = list.value.splice(oldIndex, 1)[0]
        list.value.splice(newIndex, 0, targetRow)
        emit('sort-update', [...list.value])
      }
    }
  })
}

function showDragButton(index) {
  return props.sortable && !props.notDraggableIndices.includes(index)
}

function handleCellMouseEnter(row) {
  row.showButtons = true
  emit('cell-mouse-enter', row)
}

function handleCellMouseLeave(row) {
  row.showButtons = false
  emit('cell-mouse-leave', row)
}

function handleSettings(row) {
  emit('cell-setting', row)
}

function handleDel(row) {
  emit('cell-del', row)
}
</script>

<style lang="scss">
.base-table.el-table {
  .sortable-ghost {
    opacity: 0.7;
    box-shadow: 3px 5px 5px 1px #c7c7c9;
  }

  .sortable-drag {
    opacity: 0;
  }

  .el-table__body-wrapper {
    .el-table__empty-block {
      .no-data {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          width: 131px;
          height: auto;
        }

        span {
          color: #1d2129;
          font-size: 14px;
          height: 22px;
          line-height: 22px;
        }
      }
    }

    .el-table__row {
      td.el-table__cell {
        border-bottom: none;

        .cell {
          min-height: 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: $base-gap * 10;

          .icon-move {
            font-size: 18px;
            cursor: move;
            color: $icon-color;
            margin-right: $base-gap * 2;
          }

          .btn-actions {
            display: flex;

            i {
              margin: 0 $base-gap * 2;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>
