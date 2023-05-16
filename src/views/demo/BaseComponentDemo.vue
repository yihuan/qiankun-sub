<template>
  <div class="base-component-demo">
    <div class="section-item">
      <h3>EeEditor</h3>
      <el-button type="primary" size="mini" @click="handleEditorChange">
        Change Height
      </el-button>
      <EeEditor :height="editorHeight" :statusbar="statusbar" />
    </div>
    <div class="section-item">
      <h3>自定义表单item</h3>
      <div style="margin: 8px">
        <el-form ref="formRef" :model="form" :rules="rules" size="mini">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <FormItemEmitter v-model="form.address" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="handleSave">
              Save
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormItemEmitter from './CustomizedFormItem.vue'
import EeEditor from '@/components/common/EeEditor.vue'

const form = ref({
  name: '',
  address: ''
})
const formRef = ref(null)
const rules = {
  name: [{ required: true, message: 'Pls input name', trigger: 'change' }],
  address: [{ required: true, message: 'Pls input address', trigger: 'change' }]
}

const editorHeight = ref(400)
const statusbar = ref(false)

const handleEditorChange = () => {
  editorHeight.value = 200
  statusbar.value = true
}

function handleSave() {
  formRef.value.validate((valid) => {
    console.log('valid:', valid) // eslint-disable-line
  })
}
</script>

<style lang="scss" scoped>
.base-component-demo {
  height: 100%;
  overflow: auto;
  padding: $base-gap * 4;

  .section-item {
    margin: $base-gap * 4 0;

    h3 {
      margin-bottom: $base-gap * 4;
    }
  }

  .task-item-progress {
    padding: $base-gap * 3;

    .title {
      margin-bottom: $base-gap * 6;

      & > span {
        color: $font-color;
        font-size: $font-size;
        font-weight: 600;
      }
    }

    .progress-bars {
      .bar-item {
        display: flex;
        align-items: center;
        margin: $base-gap * 3 0;

        & > span {
          flex: 0 0 60px;
          font-weight: 600;
          color: $font-color;
          font-size: $font-size;

          &:last-child {
            margin-left: $base-gap * 2;
            color: $secondary-text-color;
          }
        }

        .progress-bar {
          position: relative;
          width: 100%;
          height: 6px;
          border-radius: 100px;
          overflow: hidden;
          vertical-align: middle;

          &__inner {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
          }

          &.req {
            background-color: #d2e1ff;

            .progress-bar__inner {
              background-color: #84adff;
            }
          }

          &.task {
            background-color: #b8efd5;

            .progress-bar__inner {
              background-color: #2cc085;
            }
          }

          &.bug {
            background-color: #ffe4d0;

            .progress-bar__inner {
              background-color: #ffcc99;
            }
          }
        }
      }
    }
  }
}
</style>
