<template>
  <el-pagination
    class="ee-pagination"
    :style="paginationStyle"
    background
    :layout="layout"
    :page-size="pageSize"
    :page-sizes="pageSizes"
    :current-page="currentPage"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @prev-click="handlePrev"
    @next-click="handleNext"
  ></el-pagination>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 40, 50, 100]
  },
  currentPage: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    required: true
  },
  align: {
    type: String,
    default: 'right'
  },
  layout: {
    type: String,
    default: 'total, prev, pager, next, sizes'
  }
})
const emit = defineEmits(['size-change', 'current-change', 'prev', 'next'])

const paginationStyle = computed(() => {
  return props.align ? { textAlign: props.align } : {}
})
function handleSizeChange(size) {
  emit('size-change', size)
}

function handleCurrentChange(page) {
  emit('current-change', page)
}

function handlePrev(page) {
  emit('prev', page)
}

function handleNext(page) {
  emit('next', page)
}
</script>

<style lang="scss">
.ee-pagination.el-pagination {
  font-family: PingFang SC, Helvetica Neue, Helvetica, Hiragino Sans GB,
    Microsoft YaHei, '微软雅黑', Arial, 'sans-serif', don58;
  padding: 2px 0;

  .el-pagination__total {
    font-size: 12px;
    font-weight: 400;
    color: $font-color;
  }

  .btn-prev,
  .btn-next {
    background-color: unset;
    border: 1px solid #e4e7ed;
    border-radius: $base-radius;

    .el-icon-arrow-right::before {
      content: '\e791';
      font-size: 12px;
    }
    .el-icon-arrow-left::before {
      content: '\e792';
      font-size: 12px;
    }
  }

  .el-pager {
    li {
      &:not(.disabled).active {
        border-color: #1564ff;
        color: #1564ff;
        background-color: unset;
      }

      font-size: 12px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      color: $font-color;
      background-color: unset;
    }
  }

  .el-pagination__sizes {
    border-radius: $base-radius;
    margin-right: 0;

    .el-input {
      .el-input__inner {
        font-size: 12px;
        color: $font-color;
        border-radius: $base-radius;
      }
    }
  }
}
</style>
