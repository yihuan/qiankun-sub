<template>
  <div>
    <input v-model="inputVal" type="text" />
  </div>
</template>

<script>
import emmiter from 'element-ui/lib/mixins/emitter'

export default {
  mixins: [emmiter],
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputVal: ''
    }
  },
  watch: {
    value(val) {
      this.inputVal = val
    },
    inputVal(val) {
      this.dispatch('ElFormItem', 'el.form.change', [val])
      this.$emit('input', val)
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
