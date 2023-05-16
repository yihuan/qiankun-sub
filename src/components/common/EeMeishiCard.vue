<template>
  <span
    :class="['meishi-card', disabled ? 'meishi-card--disabled' : '']"
    @click.stop
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot></slot>
  </span>
</template>

<script setup>
import { ref } from 'vue'
import debounce from 'lodash/debounce'
// Add this to your project first: https://j1.58cdn.com.cn/meishi_sdk/meishiPersonalCard.js
import { getMeishiAuthCode } from '@/request/apis/third-party.api'

const props = defineProps({
  userName: String,
  userLabel: String,
  disabled: {
    type: Boolean,
    default: false
  }
})

// 计时器，快速划过场景，不触发获取美事卡片逻辑
let timer = null
const MAX_RETRY_TIME = 3
const EXPIRED_CODE = '-1207'
const APP_NAME = 'ee'
const authCode = ref('')
const retryCount = ref(0)

const handleMouseEnter = (event) => {
  timer = setTimeout(() => {
    clearTimeout()
    timer = null
    retryCount.value = 0
    handleOpenCard(event)
  }, 200)
}

const handleMouseLeave = () => {
  clearTimeout(timer)
  timer = null
}

const handleOpenCard = debounce(async function (event) {
  if (
    props.disabled ||
    !props.userName ||
    (props.userLabel && props.userLabel === '云效')
  ) {
    return
  }

  if (!authCode.value) {
    authCode.value = await getAuthCode()
  }
  openMeishiCard(event)
}, 100)

async function getAuthCode() {
  const res = await getMeishiAuthCode({
    userName: props.userName
  })
  return res?.data
}

function openMeishiCard(event) {
  window.meishiPersonalCard(event, APP_NAME, authCode.value, async (err) => {
    if (err.code === EXPIRED_CODE && retryCount.value < MAX_RETRY_TIME) {
      authCode.value = await getAuthCode()
      retryCount.value++
      openMeishiCard(event)
    }
  })
}
</script>

<style lang="scss" scoped>
.meishi-card {
  cursor: pointer;

  &--disabled {
    cursor: auto;
  }
}
</style>
