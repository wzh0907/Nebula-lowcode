<template>
  <div :id="id" v-loading="loading" :style="{width: width, height: height}" class="fm-code-editor">{{ codeValue }}</div>
</template>

<script>
import {loadJs} from '../../util'

export default {
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    mode: {
      type: String,
      default: 'xml'
    },
    editorOptions: {
      type: Object,
      default: () => {
      }
    },
    value: {
      type: [String, Object],
      default: ''
    },
    insertValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      id: 'code_' + Math.random().toString(36).slice(-8),
      codeValue: this.value,
      loading: true
    }
  },
  computed: {
    aceMode() {
      switch (this.mode) {
        case 'xml':
          return 'ace/mode/xml'
        case 'html':
          return 'ace/mode/html'
        case 'css':
          return 'ace/mode/css'
        case 'js':
          return 'ace/mode/javascript'
        case 'json':
          return 'ace/mode/json'
        case 'python':
          return 'ace/mode/python'
        case 'java':
          return 'ace/mode/java'
        case 'groovy':
          return 'ace/mode/groovy'
        case 'php':
          return 'ace/mode/php'
        case 'golang':
          return 'ace/mode/golang'
        case 'sql':
          return 'ace/mode/sql'
        default:
          return 'ace/mode/xml'
      }
    }
  },
  watch: {
    insertValue(val) {
      if (!val) return false
      this.insertEditor(val)
    },
    value(val) {
      this.codeValue = val
      this.$forceUpdate();
    },
    codeValue(val) {
      this.$emit('input', val)
    },
    aceMode(val) {
      this.loadEditor()
    }
  },
  mounted() {
    setTimeout(() => {
      if (window.ace) {
        this.loadEditor()
      } else {
        loadJs('https://unpkg.com/form-making/public/lib/ace/ace.js').then(() => {
          this.loadEditor()
        })
      }
    }, 0)
    console.log("editor----------", this.value)
  },
  methods: {
    loadEditor() {
      console.log('loadEditor');
      this.loading = false

      // eslint-disable-next-line no-undef
      const editor = ace.edit(this.id)
      this.editor = editor

      editor.session.setMode(this.aceMode)

      // 启用提示菜单
      editor.setTheme('ace/theme/xcode')
      ace.require('ace/ext/language_tools')
      let options = {
        // ...this.editorOptions,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: '14px',
        showGutter: true
      }
      editor.setOptions(options)

      editor.on('change', (e) => {
        // console.log(editor.getValue())
        this.codeValue = editor.getValue()
      })
    },
    clearEditor() {
      const editor = ace.edit(this.id)
      editor.setValue('')
    },
    setValue(val) {
      this.editor.session.setValue(val)
    },
    insertEditor(val) {
      // console.log('insertEditor=', val);
      let cursorPosition = this.editor.getCursorPosition();
      this.editor.session.insert(cursorPosition, val);
    }
  }
}
</script>

<style lang="scss">
.fm-code-editor {
  border: 1px solid #DCDFE6;
}

// 修复编辑框内有一条竖线的问题
.ace_print-margin {
  display: none;
}
</style>
