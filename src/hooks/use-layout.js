import { ref } from 'vue'

export function useLayout() {
  const contentHeight = ref('auto')

  function handleHeightUpdate(height) {
    contentHeight.value = height
  }

  return { contentHeight, handleHeightUpdate }
}
