import { isRef, reactive, ref, unref, watchEffect } from 'vue'
import * as planApi from '@/request/apis/plan.api'
import { useRoute } from 'vue-router/composables'
import { useBaseStore } from '@/hooks/use-base-store'

export function usePackage(productName) {
  const loading = ref(false)
  const packages = ref([])
  const total = ref(0)
  const route = useRoute()
  const searchParams = reactive({
    flowName: '',
    pkType: 3,
    sysType: -1,
    id: route.params.id
  })
  const { updateProductName } = useBaseStore()

  if (isRef(productName)) {
    watchEffect(getPackages)
  } else {
    getPackages()
  }

  function getPackages(params) {
    loading.value = true
    planApi
      .getPackageList({
        prodName: unref(productName),
        page: 1,
        pageSize: 10,
        ...searchParams,
        ...params
      })
      .then((res) => {
        const data = res?.data
        packages.value = data?.data
        total.value = data?.totalCount ?? 0
        updateProductName(data?.productName)
      })
      .finally(() => {
        loading.value = false
      })
  }

  return {
    loading,
    searchParams,
    packages,
    getPackages,
    total
  }
}
