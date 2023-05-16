<template>
  <el-select
    v-model="selected"
    popper-class="tag-select"
    :placeholder="placeholder"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    @change="handleChange"
  >
    <el-option
      v-for="t in options"
      :key="t[valueProp]"
      :label="t[labelProp]"
      :value="t[valueProp]"
    >
      <span
        class="tag-select__label"
        :style="{ backgroundColor: t[colorProp] }"
      >
        {{ t[labelProp] }}
      </span>
    </el-option>
  </el-select>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number, Array],
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  optionProp: {
    type: Object,
    default: () => ({
      lable: 'msg',
      value: 'code',
      color: 'color'
    })
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  multipleLimit: {
    type: Number,
    default: 3
  }
})
const emit = defineEmits(['input', 'change'])

const selected = ref([])
const labelProp = computed(() => props.optionProp.label || 'msg')
const valueProp = computed(() => props.optionProp.value || 'code')
const colorProp = computed(() => props.optionProp.color || 'color')

watch(
  () => props.value,
  (val) => {
    selected.value = val
  },
  { immediate: true }
)

function handleChange(event) {
  emit('input', event)
  emit('change', event)
}
</script>

<style lang="scss" scoped>
.tag-select.el-select-dropdown {
  .el-select-dropdown__item {
    padding: 0;
    margin: $base-gap 0;

    &:first-child,
    &:last-child {
      margin-top: 0;
    }

    .tag-select__label {
      display: inline-block;
      color: $primary-color;
      width: 100%;
      padding: 0 $base-gap * 4;
      border-radius: 4px;
    }
  }
}
</style>
