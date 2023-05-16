<template>
  <div class="draggable-demo">
    <div class="demo-item">
      <h3>BaseDraggable</h3>
      <BaseDraggable v-model="list">
        <div
          v-for="l in list"
          :key="l.id"
          style="
            border: 1px solid lightgrey;
            padding: 16px 8px;
            marign: 8px 0;
            cursor: move;
          "
        >
          {{ l.name }}
        </div>
      </BaseDraggable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseDraggable from '@/components/common/BaseDraggable.vue'

const list = ref([
  {
    id: 1,
    name: 'app01',
    children: [
      {
        id: 11,
        name: 'app01-1'
      },
      {
        id: 12,
        name: 'app01-2'
      }
    ]
  },
  {
    id: 2,
    name: 'app02'
  },
  {
    id: 3,
    name: 'app03'
  }
])
</script>

<style lang="scss" scoped>
@import 'demo';
</style>
