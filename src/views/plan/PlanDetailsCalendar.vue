<template>
  <div
    class="table-demo demo-item"
    style="width: 100%; height: 100%"
    @mousewheel="mousewheel"
  >
    <iframe
      id="calendar"
      ref="vueIframe"
      name="calendar"
      scrolling="no"
      crossorign="yes"
      style="width: 100%; height: 97%"
      src="https://docs.qq.com/sheet/DTUZQYW9PbFZiRVFH?tab=iib2ra"
    />
  </div>
</template>
<script setup>
/* eslint-disable */
import { ref, onMounted, getCurrentInstance } from 'vue'

function mousewheel(e) {
  console.log('loading mousewheel')
  e.preventDefault()
}

const vueIframe = ref()

onMounted(() => {
  let y = vueIframe.value.contentWindow.document
  console.log(y)

  //const a = getCurrentInstance().proxy.$refs.vueIframe
  //console.log(a)
  //vueIframe.value.contentWindow.document.addEventListener('load', function () {
  //alert(1)
  //})
})
</script>
<style lang="scss" scoped></style>
