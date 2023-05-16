<template>
  <div class="template-details">
    <BaseTemplate :data="data" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router/composables'
import BaseTemplate from '@/components/template/BaseTemplate.vue'
import { getTemplateById } from '@/request/apis/template.api'

const route = useRoute()

const data = ref([])

getTemplateById(route.params.id).then((res) => {
  data.value = res.data
})
</script>

<style lang="scss" scoped>
.template-details {
}
</style>
