<template>
  <el-select
    v-model="sysType"
    :placeholder="placeholder"
    :size="size"
    @change="handleChange"
  >
    <el-option
      v-for="t in systemTypes"
      :key="t.value"
      :value="t.value"
      :label="t.label"
    />
  </el-select>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { SystemType } from '@/constants/plan.const'
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
const emit = defineEmits('input', 'change')

const systemTypes = [
  {
    label: '全部',
    value: SystemType.ALL
  },
  {
    label: 'Android',
    value: SystemType.ANDROID
  },
  {
    label: 'iOS',
    value: SystemType.IOS
  }
]
const sysType = ref(SystemType.ALL)

watchEffect(() => {
  sysType.value = props.value
})

function handleChange(value) {
  emit('input', value)
  emit('change', value)
}
</script>

<style lang="scss" scoped></style>
