import { isRef, ref, watchEffect } from 'vue'

/**
 * 自定义弹窗 Hook
 * 使用方需定义 input 和 close 事件：`const emit = defineEmits(['input', 'close'])`
 * @param {Object} modelValue - 当前自定义弹窗的 v-model 值，一般为 props.value，通过 toRef(props, 'value') 转换后传入
 * @param {function} emit - emit function (defineEmits macro in Composition API)
 * @returns {object} - 可用参数
 * {
 *   visible: boolean; 弹窗 v-model
 *   close: function; 关闭弹窗方法
 *   cancel: function; 取消弹窗方法
 *   handleClose: function; 关闭弹窗事件（弹窗右上角关闭按钮）
 *   handleCancel: function; 取消弹窗（弹窗中按钮使用）
 * }
 */
export function useDialog(modelValue, emit = () => {}) {
  if (!isRef(modelValue)) {
    throw Error(
      '`modelValue` should be a ref from `value`, you can use `toRef(props.value)` to transform it'
    )
  }

  const visible = ref(false)
  const closeParams = ref('')

  watchEffect(() => {
    visible.value = modelValue.value
  })

  /**
   * 取消弹窗
   */
  function cancel() {
    emit('input', false)
  }

  /**
   * 关闭弹窗
   */
  function close(params) {
    closeParams.value = params ?? false
    emit('input', false)
  }

  /**
   * 关闭弹窗事件
   */
  function handleClose() {
    emit('close', closeParams.value ?? false)
    emit('input', false)
    closeParams.value = '' // 清空参数
  }

  /**
   * 取消弹窗
   * 解决 close 方法调用两次的问题，因为弹窗 v-model 为 false 时会触发
   * handleClose 进而触发 close 事件
   */
  function handleCancel() {
    cancel()
  }

  return { visible, handleClose, close, handleCancel, cancel }
}
