<template>
  <div class="simpleSelect">
    <el-select
      v-model="selected"
      :disabled="disabled"
      :clearable="clearable"
      :placeholder="placeholder"
      :popper-append-to-body="false"
    >
      <el-option
        v-for="item in selectList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
        <div class="msg ellipsis">
          {{ item.label }}
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { computed, ref, toRefs, watch, watchEffect } from 'vue'
import isEmpty from 'lodash/isEmpty'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  selectList: {
    type: Array,
    default: () => []
  },
  selectedOption: {
    //已选项，不传默认选择第一项
    type: [Array, String, Object],
    default: () => []
  },
  width: {
    //宽度
    type: Number
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  clearable: {
    type: Boolean,
    default: false
  },
  mr: {
    type: String,
    default: '12'
  }
})
const emit = defineEmits(['selectChange'])

const { selectList, disabled } = toRefs(props)
const selected = ref()

const selectWidth = computed(() => props.width + 'px')
const marginRight = computed(() => props.mr + 'px')

watchEffect(() => {
  if (props.selectedOption) {
    selected.value = props.selectedOption
    return
  }
  if (!isEmpty(props.selectList)) {
    selected.value = props.selectList[0].value
    return
  }
  // default value
  selected.value = ''
})
watch(selected, () => {
  const selectedOption = props.selectList.find(
    (cur) => cur.value === selected.value
  )
  emit('selectChange', selectedOption)
})
</script>

<style lang="scss" scoped>
.simpleSelect :deep(.el-select) {
  width: v-bind('selectWidth');
  height: 32px;
  border: 1px solid rgba(228, 231, 237, 1);
  border-radius: 4px;
  margin-right: v-bind('marginRight');
  &:hover {
    border-color: #1564ff;
  }
  .el-input {
    .el-input__prefix {
      left: 12px;
    }
    .el-input__inner {
      border: none;
      height: 30px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      color: rgba(27, 28, 30, 1);
      text-align: center;
      padding-left: 12px;
      padding-right: 25px;
    }
    .el-input__suffix {
      right: 2px;
    }
    .el-input__icon {
      height: 40px;
      position: relative;
      top: -5px;
    }
  }
  .el-select-dropdown__list {
    width: 140px;
    .el-select-dropdown__item {
      padding: 0 8px;
    }
    .selected {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: 400;
      color: rgba(27, 28, 30, 1);
    }
  }
}
.check {
  float: right;
}
.msg {
  display: inline-block;
  width: 90px;
}
</style>
