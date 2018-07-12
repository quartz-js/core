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
import 'codemirror/mode/htmlmixed/htmlmixed.js'

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
        mode: 'text/html',
        theme: 'material',
        showInvisibles: true,
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        autoCloseBrackets: true
      }
    }
  },
  created () {
    this.rawValue = this.beautify(this.value);
  },

  methods: {

    fix () {
      this.rawValue = this.rawValue;
    },

    beautify (text) {
      return text;
    },

    onCursorActivity ($event) {
      this.doc = $event.doc;
    },

    onInput ($event) {
      this.$emit('input', $event);
      // $event = this.beautify($event);

      var pos_original = this.doc.getCursor();

      //
    }
  }
}

</script>
<style>
.editor .CodeMirror {
height: 700px;
}

.editor {
height: 700px;
}
.editor > * {
height:auto !important;

}
</style>
