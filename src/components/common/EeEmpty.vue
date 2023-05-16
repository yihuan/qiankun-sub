<template>
  <div :class="['ee-empty', border ? 'ee-empty--border' : '']">
    <div class="ee-empty__img"></div>
    <div v-if="text" class="ee-empty__text">{{ text }}</div>
    <div v-if="$slots.default" class="ee-empty__options">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: String,
  border: Boolean,
  height: {
    type: String,
    default: '100%'
  }
})
</script>

<style lang="scss" scoped>
.ee-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: v-bind(height);
  width: 100%;
  background: $color-white;
  &--border {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
  }
  &__img {
    width: 160px;
    height: 160px;
    background: url('https://img.58cdn.com.cn/arthurupload/teg/yunxiao/static/images/icons/no-result.png')
      no-repeat;
    // background: url('~@/assets/icons/no-result.png') no-repeat;
    background-size: 100%;
  }

  &__text {
    margin-top: 10px;
    color: $tips-color;
    font-size: $font-size;
  }

  &__options {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 10px;
  }
}
</style>
