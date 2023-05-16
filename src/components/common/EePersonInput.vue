<!--
  人员输入框搜索框组件
  默认为远程搜索，如要默认显示指定值，则需指定 options 以用来显示，options 里对象格式见 options
  属性注释
-->
<template>
  <el-select
    v-model="selected"
    :loading="loading"
    :loading-text="loadingText"
    value-key="userName"
    :disabled="disabled"
    popper-class="ee-person-input"
    remote
    :remote-method="remoteMethod"
    :placeholder="placeholder"
    :size="size"
    :multiple="multiple"
    filterable
    :clearable="clearable"
    :visible-arrow="false"
    :collapse-tags="collapseTags"
    @change="handleChange"
    @visible-change="handleVisibleChange"
  >
    <el-option v-for="u in users" :key="u.id" :label="u.nickName" :value="u">
      <div class="person-item">
        <img :src="u.img" :alt="u.nickName" class="avatar" />
        <div class="content">
          <div class="name">{{ u.nickName }}({{ u.userName }})</div>
          <div class="org">{{ u.orgName }}</div>
        </div>
      </div>
    </el-option>
  </el-select>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import * as userApi from '@/request/apis/user.api'
import { throwError } from '@/utils/log.util'
import profileIcon from '@/assets/images/profile.png'

const props = defineProps({
  /**
   * 值为对象或数组
   * 如果为单选，则初始选中格式应该为：{ userName: 'zhangsan', nickName: '张三' }
   * 如果为多选，则初始选中格式应该为：[{ userName: 'zhangsan', nickName: '张三' }]
   */
  value: {
    type: [Array, Object],
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请输入OA或姓名'
  },
  size: {
    type: String,
    default: 'mini'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: true
  },
  collapseTags: {
    type: Boolean,
    default: true
  },
  loadingText: {
    type: String,
    default: '无匹配数据'
  },
  /**
   * 选项值，可通过 dataProps 指定其他字段
   * {
   *   nickName: string; // 中文名
   *   userName: string; // 用户名（拼音）
   *   img: string;      // 头像
   *   orgName: string;  // 所属部门，如：技术工程平台群-云效平台部
   * }
   */
  options: {
    type: Array,
    default: () => []
  },
  dataProp: {
    type: Object,
    default: () => ({
      id: 'id',
      nickName: 'nickName',
      userName: 'userName',
      img: 'img',
      orgName: 'orgName'
    })
  },
  /**
   * 查询用户方法，替换默认接口，返回值属性通过 dataProp 指定
   */
  searchFunc: {
    type: Function,
    default: null
  }
})
const emit = defineEmits(['change', 'input'])

const loading = ref(false)
const selected = ref()
const users = ref([])
const queryKeyword = ref('')

const idProp = computed(() => props.dataProp.id || 'id')
const nickNameProp = computed(() => props.dataProp.nickName || 'nickName')
const userNameProp = computed(() => props.dataProp.userName || 'userName')
const imgProp = computed(() => props.dataProp.img || 'img')
const orgNameProp = computed(() => props.dataProp.orgName || 'orgName')

const optionsValue = computed(() => {
  return getMappedValue(props.options)
})

watchEffect(() => {
  selected.value = props.multiple ? getMappedValue(props.value) : props.value
})

watchEffect(() => {
  if (props.multiple) {
    users.value = optionsValue.value
  }
})

function getMappedValue(list) {
  return (
    list?.map((x, index) => ({
      id: x[idProp.value] ?? index + 1,
      nickName: x[nickNameProp.value],
      userName: x[userNameProp.value],
      img: x[imgProp.value] ?? profileIcon,
      orgName: x[orgNameProp.value]
    })) ?? []
  )
}

function remoteMethod(query) {
  queryKeyword.value = query
  if (query !== '') {
    getUsers(query)
  } else {
    users.value = []
  }
}

function getUsers(search) {
  loading.value = true
  if (props.searchFunc) {
    if (!props.searchFunc()?.then) {
      throwError('search-func should return a Promise')
    }
    props
      .searchFunc(search)
      .then((res) => {
        users.value = getMappedValue(res)
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    userApi
      .searchUsers(search)
      .then((res) => {
        users.value = res?.userList
      })
      .finally(() => {
        loading.value = false
      })
  }
}

/**
 * 点击显示列表但不是搜索时默认展示 options 里的值
 * @param {boolean} visible - 是否显示列表
 */
function handleVisibleChange(visible) {
  if (visible && !queryKeyword.value) {
    users.value = optionsValue.value
  }
}

function handleChange(event) {
  // 与入参保持一致，兼容现有情况
  let value = []
  if (props.multiple) {
    value = event?.map((x) => ({
      [idProp.value]: x[idProp.value] || x.id,
      [nickNameProp.value]: x[nickNameProp.value] || x.nickName,
      [userNameProp.value]: x[userNameProp.value] || x.userName,
      [imgProp.value]: x[imgProp.value] || x.img,
      [orgNameProp.value]: x[orgNameProp.value] || x.orgName
    }))
  } else {
    value = {
      [idProp.value]: event[idProp.value] || event.id,
      [nickNameProp.value]: event[nickNameProp.value] || event.nickName,
      [userNameProp.value]: event[userNameProp.value] || event.userName,
      [imgProp.value]: event[imgProp.value] || event.img,
      [orgNameProp.value]: event[orgNameProp.value] || event.orgName
    }
  }
  emit('input', value)
  emit('change', value)
}
</script>

<style lang="scss">
.ee-person-input {
  .popper__arrow {
    display: none;
  }

  &.el-popper[x-placement^='bottom'] {
    margin-top: $base-gap;
  }

  .el-select-dropdown__item {
    height: 100%;
    padding: 0 $base-gap * 2;

    &.selected {
      padding: 0 $base-gap * 2;
      background-color: $hover-bg-color;

      .person-item {
        .content {
          .name {
            font-weight: 400;
          }
        }
      }
    }

    .person-item {
      display: flex;
      align-items: center;
      padding: $base-gap * 2;

      .avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        margin-right: $base-gap * 2;
      }

      .content {
        display: flex;
        flex-direction: column;

        .name {
          font-size: 14px;
          color: $font-color;
          line-height: 20px;
        }

        .org {
          font-size: 12px;
          color: $icon-color;
          line-height: 16px;
          margin-top: $base-gap;
        }
      }
    }
  }
}
</style>
