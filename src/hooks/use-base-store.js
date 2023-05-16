import { getCurrentInstance } from 'vue'
import { useAppStore } from '@/stores'

/**
 * 更新主应用（iBase）信息
 * @returns {Object} - 更新主应用方法
 * {
 *   updateProductName: Function; 更新主应用（头部）产品选中
 * }
 */
export function useBaseStore() {
  const { proxy } = getCurrentInstance()
  const iciStore = proxy.parentStore?.useIciStore()
  const appStore = useAppStore()

  /**
   * 更新产品名称
   * @param {string} name - 产品名称
   */
  function updateProductName(name) {
    iciStore.appFromSub = name
    appStore.appName = name
  }

  return { iciStore, updateProductName }
}
