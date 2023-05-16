<template>
  <Transition
    :name="name"
    :mode="mode"
    :appear="appear"
    :css="css"
    :enter-from-class="enterFromClass"
    :enter-active-class="enterActiveClass"
    :enter-to-class="enterToClass"
    :leave-from-class="leaveFromClass"
    :leave-active-class="leaveActiveClass"
    :leave-to-class="leaveToClass"
    @before-enter="handleBeforeEnter"
    @enter="handleEnter"
    @after-enter="handleAfterEnter"
    @enter-cancelled="handleEnterCancelled"
    @before-leave="handleBeforeLeave"
    @leave="handleLeave"
    @after-leave="handleAfterLeave"
    @leave-cancelled="handleLeaveCancelled"
  >
    <slot />
  </Transition>
</template>

<script setup>
defineProps({
  name: String,
  mode: String,
  appear: {
    type: Boolean,
    default: false
  },
  css: {
    type: Boolean,
    default: true
  },
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
})
const emit = defineEmits([
  'before-enter',
  'enter',
  'after-enter',
  'enter-cancellled',
  'before-leave',
  'leave',
  'after-leave',
  'leave-cancelled'
])

function handleBeforeEnter(el) {
  emit('before-enter', el)
}

function handleEnter(el, done) {
  emit('enter', el, done)
}

function handleAfterEnter(el) {
  emit('after-enter', el)
}

function handleEnterCancelled(el) {
  emit('enter-cancelled', el)
}

function handleBeforeLeave(el) {
  emit('before-leave', el)
}

function handleLeave(el, done) {
  emit('leave', el, done)
}

function handleAfterLeave(el) {
  emit('after-leave', el)
}

function handleLeaveCancelled(el) {
  emit('leave-cancelled', el)
}
</script>

<style lang="scss"></style>
