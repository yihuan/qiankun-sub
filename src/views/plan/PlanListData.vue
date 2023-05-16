<!--
  版本计划列表数据页，分为列表和卡片列表
  列表数据在 PlanList 获取，编辑和删除通过事件传递到 PlanList 来刷新列表数据
  @param {Object} plans - 列表数据
  @param {string} listType - 列表类型，分为 card（卡片类型），list（列表类型）
  @param {boolean} hasAuth - 是否有权限
-->
<template>
  <div class="plan-list">
    <div v-show="listType === 'card'" class="plan-list__item-cards">
      <PlanListCard
        v-for="p in plans"
        :key="p.id"
        :data="p"
        :has-auth="hasAuth"
        @edit="handleItemEdit"
      />
    </div>
    <PlanListTable
      v-show="listType === 'list'"
      :data="plans"
      style="width: 100%"
      :has-auth="hasAuth"
      @edit="handleItemEdit"
      @delete="handleItemDelete"
    />
  </div>
</template>

<script setup>
import PlanListCard from '@/components/plan/PlanListCard.vue'
import PlanListTable from '@/components/plan/PlanListTable.vue'

defineProps({
  plans: {
    type: Array,
    default: () => []
  },
  listType: {
    type: String,
    default: 'card',
    validator: (value) => ['list', 'card'].includes(value)
  },
  hasAuth: {
    type: Boolean
  }
})
const emit = defineEmits('item-delete', 'item-edit')

function handleItemEdit(item) {
  emit('item-edit', item)
}

function handleItemDelete() {
  emit('item-delete')
}
</script>

<style lang="scss" scoped>
.plan-list {
  padding: 0;

  &__item-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: $base-gap * 5;
  }
}
</style>
