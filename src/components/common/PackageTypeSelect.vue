<template>
  <el-select
    v-model="pkType"
    :placeholder="placeholder"
    :size="size"
    @change="handleChange"
  >
    <el-option
      v-for="t in packageTypes"
      :key="t.value"
      :value="t.value"
      :label="t.label"
    />
  </el-select>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { PackageType } from '@/constants/plan.const'
import { Size, SIZES } from '@/constants/elementui.const'

const props = defineProps({
  value: {
    type: Number
  },
  size: {
    type: String,
    default: Size.MINI,
    validator: (val) => SIZES.includes(val)
  },
  placeholder: {
    type: String,
    default: '请选择'
  }
})
const emit = defineEmits('change')

const packageTypes = ref([
  {
    label: '构建包',
    value: PackageType.BUILD
  },
  {
    label: '灰度包',
    value: PackageType.GRAY
  },
  {
    label: '全量包',
    value: PackageType.RELEASE
  }
])
const pkType = ref(PackageType.BUILD)

watchEffect(() => {
  pkType.value = props.value
})

function handleChange(value) {
  emit('change', value)
}
</script>

<style lang="scss" scoped></style>
