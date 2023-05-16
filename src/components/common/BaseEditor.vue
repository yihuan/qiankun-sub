<!--
  Description: Refactoring of EeEditor to be more generic
-->
<template>
  <div
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    class="ee-editor"
  >
    <!-- eslint-disable vue/v-on-event-hyphenation -->
    <Editor
      v-model="content"
      :tinymce-script-src="tinymceScriptSrc"
      :init="init"
      :plugins="plugins"
      :toolbar="toolbar"
      :disabled="disabled"
      :inline="inline"
      :tag-name="tagName"
      :output-format="outputFormat"
      @onInit="handleInit"
      @onKeyup="handleKeyup"
      @onChange="handleChange"
      @onBlur="handleBlur"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'

const props = defineProps({
  value: {
    type: String
  },
  disabled: {
    type: Boolean
  },
  inline: {
    type: Boolean
  },
  tagName: {
    type: String
  },
  width: {
    type: [Number, String]
  },
  height: {
    type: [Number, String],
    default: 400
  },
  menubar: {
    type: Boolean
  },
  statusbar: {
    type: Boolean
  },
  outputFormat: {
    type: String,
    default: 'html',
    validator: (val) => ['html', 'text'].includes(val)
  },
  isFixed: {
    type: String,
    default: ''
  },
  minHeight: {
    type: Number
  },
  maxHeight: {
    type: Number
  },
  autoSave: {
    type: Boolean,
    default: true
  },
  imageUploadHandler: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['input', 'blur'])

const cdnDomain = 'https://j1.58cdn.com.cn'
const baseUrl = cdnDomain + '/arthurupload/teg/yunxiao/static/tinymce'
const tinymceScriptSrc =
  cdnDomain + '/arthurupload/teg/yunxiao/static/tinymce/tinymce.min.js'

const init = {
  width: props.width,
  height: props.height,
  menubar: props.menubar,
  statusbar: props.statusbar,
  branding: false,
  base_url: baseUrl,
  plugins: ['autoresize'],
  max_height: props.maxHeight,
  paste_data_images: true,
  images_upload_handler: props.imageUploadHandler,
  min_height: props.minHeight,
  placeholder: props.placeholder,
  content_style: 'img {max-width: 100%}'
}
const plugins = 'fullscreen lists link image table code wordcount code paste'
const toolbar = `fullscreen | undo redo | bold italic underline |
    forecolor backcolor | bullist numlist | link | table`

const content = ref(props.value)
const loading = ref(true)

watch(content, (val) => {
  emit('input', val)
})

watch(
  () => props.value,
  (val) => {
    content.value = val
  }
)

const handleInit = () => {
  loading.value = false
}

// eslint-disable-next-line
const handleKeyup = (event, editor) => {}

// eslint-disable-next-line
const handleChange = (event, editor) => {}
// eslint-disable-next-line
const handleBlur = (event, editor) => {
  emit('blur', content.value)
}
</script>

<style lang="scss">
.tox.tox-silver-sink.tox-tinymce-aux {
  z-index: 9999 !important;

  .tox-notifications-container {
    display: none;
  }
}

.ee-editor {
  .tox.tox-tinymce {
    border: 1px solid $line-color;

    .tox-editor-container {
      .tox-editor-header {
        position: v-bind(isFixed);
        top: 10px;

        .tox-toolbar__primary {
          background: none;
          border-bottom: 1px solid $line-color;

          .tox-toolbar__group:not(:last-of-type) {
            border-right: 1px dashed #ccc;
          }
        }
      }
    }
  }
}
</style>
