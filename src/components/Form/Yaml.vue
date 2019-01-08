<template>

  <div>
    <codemirror
      :value="rawValue"
      :options="options"
      @input="onInput($event)"
      @cursorActivity="onCursorActivity"
      @blur = "fix"
    />
  </div>
</template>

<script>

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/mode/yaml/yaml.js'

export default {
  components: {
    codemirror
  },

  props: ['json', 'value'],
  data () {
    return {
      rawValue: '',
      doc: null,
      options: {
        tabSize: 2,
        mode: 'text/x-yaml',
        theme: 'material',
        showInvisibles: true,
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        autoCloseBrackets: true
      }
    }
  },
  watch: {
    value: function (){
      this.reloadRawValue();
    }
  },
  mounted () {
    this.rawValue = this.beautify(this.value);
  },

  methods: {
    reloadRawValue() {
      this.rawValue = this.beautify(this.value);
    },

    fix () {
      this.rawValue = this.rawValue;
    },

    beautify (text) {
      return text ? text : '';
    },

    onCursorActivity ($event) {
      this.doc = $event.doc;
    },

    onInput ($event) {
      this.$emit('input', $event);
    }
  }
}

</script>
<style>
.editor .CodeMirror {
  height: 800px;
}

.editor {
  height: 800px;
}

.editor > * {
  height:auto !important;

}
</style>
