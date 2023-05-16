import { isRef, ref, unref, watchEffect } from 'vue'
import { useStorage } from '@vueuse/core'
import * as planApi from '@/request/apis/plan.api'
import { PlanStatus } from '@/constants/plan.const'
import { usePlanStore } from '@/stores'
import { LocalStorageItem } from '@/constants/common.const'

export function usePlan(productName) {
  const loading = ref(false)
  const plans = ref([])
  const total = ref(0)
  const authData = ref({})
  const savedStatus = useStorage(
    LocalStorageItem.PLAN_STATUS,
    PlanStatus.PENDING
  )
  const searchParams = {
    versionNo: '',
    status: savedStatus.value
  }
  const iterations = ref([])
  // 状态为全部时的值
  const PLAN_STATUS_ALL = 4

  const planStore = usePlanStore()

  if (isRef(productName)) {
    watchEffect(getPlans)
    watchEffect(getTemplates)
    watchEffect(getIterations)
  } else {
    getPlans()
    getTemplates()
    getIterations()
  }

  function getPlans(params) {
    if (!unref(productName)) {
      return
    }

    loading.value = true
    planApi
      .getPlanList({
        prodName: unref(productName),
        page: 1,
        pageSize: 10,
        ...searchParams,
        ...params,
        status:
          searchParams.status === PLAN_STATUS_ALL ? '' : searchParams.status
      })
      .then((res) => {
        const data = res?.data
        plans.value = data?.data?.map((x) => ({
          ...x,
          iterations: x.iterationName ? JSON.parse(x.iterationName) : []
        }))
        total.value = data?.totalCount ?? 0
        authData.value = res?.rightData
      })
      .finally(() => {
        loading.value = false
      })
  }

  function getTemplates() {
    if (!unref(productName)) {
      return
    }
    planApi.getTemplateList(unref(productName)).then((res) => {
      planStore.$patch((state) => {
        state.template.defaultId = res?.data?.defaultId ?? 0
        state.template.list = res?.data?.tempList ?? []
      })
    })
  }

  function getIterations(title) {
    if (!unref(productName)) {
      return
    }
    planApi.getIterationList(unref(productName), title).then((res) => {
      planStore.$patch((state) => {
        state.iterations = res?.data ?? []
      })
    })
  }

  return {
    PLAN_STATUS_ALL,
    loading,
    searchParams,
    plans,
    authData,
    getPlans,
    total,
    getIterations,
    iterations
  }
}
