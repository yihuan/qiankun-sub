import { ref, unref } from 'vue'
import { getPlanProgress, deletePlanTask } from '@/request/apis'
import { PlanStatus } from '@/constants/plan.const'
import { useBaseStore } from '@/hooks/use-base-store'

export function usePlanProgress(id) {
  const loading = ref(false)
  const data = ref([])
  const authData = ref({})
  const filterParams = ref({
    name: '',
    operater: '',
    tag: '',
    status: ''
  })
  const isDone = ref(false)
  const { updateProductName } = useBaseStore()

  /**
   * 获取版本进展详情
   * @param {Object} params
   * {
   *   scheduleId: string; - 排期ID
   *   name: string; - 任务名称
   *   operater; string; - 任务操作人
   *   tag: string; - 标签
   *   status: string; - 状态
   * }
   */
  function getProgress(params) {
    loading.value = true
    getPlanProgress({
      scheduleId: unref(id),
      ...filterParams.value,
      ...params
    })
      .then((res) => {
        const resData = res?.data
        data.value = resData?.data
        isDone.value = resData?.status?.id === PlanStatus.DONE
        authData.value = res?.rightData
        updateProductName(resData?.product)
      })
      .finally(() => {
        loading.value = false
      })
  }

  /**
   * 删除任务
   * @param {string} id
   * @return {Promise}
   */
  function deleteTask(id) {
    return deletePlanTask(id)
  }

  return {
    loading,
    data,
    isDone,
    authData,
    getProgress,
    filterParams,
    deleteTask
  }
}
