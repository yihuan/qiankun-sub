<template>
  <div class="ee-person">
    <EeSelect
      v-model="state.choosenPerson"
      virtual
      remote
      :readonly="readonly"
      :remote-method="remoteMethod"
      :options="options"
      :prop="prop"
      :update-props="updateProps"
      :multiple="multiple"
      :infinite-scroll-disabled="infiniteScrollDisabled"
      @change="handleChange"
    >
      <template #reference>
        <EePersonLabel
          style="cursor: pointer"
          :choose-items="chooseItems"
          :prop="prop"
          :icon-max="iconMax"
          :show-label="showLabel"
        />
      </template>
    </EeSelect>
  </div>
</template>

<script setup>
import { computed, reactive, watchEffect } from 'vue'

import EeSelect from '@/components/common/EeSelect.vue'
import EePersonLabel from '@/components/common/EePersonLabel.vue'
import * as userApi from '@/request/apis/user.api'

let cachedOptions = []

const props = defineProps({
  ...EeSelect.props,
  ...EePersonLabel.props,
  value: {
    type: Array,
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  options: {
    required: false,
    type: Array,
    default: () => []
  },
  updateProps: {
    type: Object,
    default: () => ({
      code: 'userName',
      msg: 'nickName'
    })
  },
  remoteMethod: {
    type: Function
  },
  change: {
    type: Function,
    default: () => {}
  },
  infiniteScrollDisabled: {
    type: Boolean,
    default: true // 人员组件默认不支持无限加载
  }
})

const emit = defineEmits(['change', 'input'])
const state = reactive({
  choosenPerson: []
})

// 获取人员
const remoteMethod = ({ search }) => {
  return userApi.searchUsers(search).then((res) => {
    return res?.userList?.map((i) => ({
      ...i,
      code: i.userName,
      msg: `${i.nickName}${i.userName ? '(' + i.userName + ')' : ''}`,
      src: i.img,
      extraInfo: i.orgName
    }))
  })
}

watchEffect(() => {
  state.choosenPerson = props.value || []
  props.options && cachedOptions.push(...props.options)
})

watchEffect(() => {
  emit('input', state.choosenPerson)
})

const chooseItems = computed(() => {
  return state.choosenPerson
    .map((c) => {
      const item = cachedOptions.find(
        (option) => option[props.prop.value] === c
      )
      if (item) {
        return {
          ...item,
          value: item[props.prop.value],
          label: item[props.prop.label]
        }
      }
    })
    .filter((i) => i)
})

function saveChosenPerson(users) {
  const names = users.map((i) => i[props.prop.value]).join()
  if (names) {
    return userApi.setRecentChoice({
      saveName: names
    })
  }
}

const handleChange = (e) => {
  e.forEach((item) => {
    if (!cachedOptions.includes(item)) {
      cachedOptions.push(item)
    }
  })
  saveChosenPerson(e)
  emit('change', e)
  props.change(e)
}
</script>

<style lang="scss" scoped>
.ee-person {
  position: relative;
  z-index: 1;
  color: $secondary-text-color;
  min-width: 100px;
}
</style>
