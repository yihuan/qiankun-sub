<template>
  <PageVerticalLayout class="package-list">
    <template #actions>
      <el-input
        v-model="searchParams.flowName"
        size="mini"
        placeholder="流水线名称"
        @input="handleFlowNameSearch"
      />
      <PackageTypeSelect v-model="pkType" @change="handlePkTypeChange" />
      <SystemTypeSelect v-model="sysType" @change="handleSysTypeChange" />
    </template>
    <PlanPackageListTable :data="packages" style="width: 100%" />
    <template #footer>
      <EePagination
        :total="total"
        :current-page="page"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </template>
  </PageVerticalLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { debounce } from '@/utils'
import PageVerticalLayout from '@/components/common/PageVerticalLayout.vue'
import PlanPackageListTable from '@/components/plan/PlanPackageListTable.vue'
import EePagination from '@/components/common/EePagination.vue'
import { usePage } from '@/hooks/use-page'
import { usePackage } from '@/hooks/use-package'
import { PackageType, SystemType } from '@/constants/plan.const'
import SystemTypeSelect from '../../components/common/SystemTypeSelect.vue'
import PackageTypeSelect from '../../components/common/PackageTypeSelect.vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

const pkType = ref(PackageType.BUILD)

const sysType = ref(SystemType.ALL)
const prodName = computed(() => appStore.appName)
const { packages, total, searchParams, getPackages } = usePackage(prodName)

const { page, pageSize, handleCurrentChange, handleSizeChange } =
  usePage(getPackages)

const handleFlowNameSearch = debounce((value) => {
  searchParams.flowName = value
  getPackages(searchParams)
}, 300)

function handleSysTypeChange(value) {
  searchParams.sysType = value
  getPackages(searchParams)
}

function handlePkTypeChange(value) {
  searchParams.pkType = value
  getPackages(searchParams)
}
</script>

<style lang="scss" scoped>
.package-list {
  padding: 0;

  &__item-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: $base-gap * 5;
  }
}
</style>
