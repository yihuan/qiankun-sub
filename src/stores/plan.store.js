import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const usePlanStore = defineStore('plan', () => {
  const template = reactive({
    defaultId: 0,
    list: []
  })
  const iterations = ref([])
  const progressActions = ref({
    filter: {
      name: '',
      operater: '',
      status: ''
    },
    records: false
  })
  const tags = ref([])
  const flows = ref([])

  return { template, iterations, progressActions, tags, flows }
})
