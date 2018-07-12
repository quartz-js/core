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
        mode: 'application/ld+json',
        theme: 'material',
        lineNumbers: true,
        line: true,
        lineWrapping: true,
        autoCloseBrackets: true
      }
    }
  },
  created () {
    this.rawValue = JSON.stringify(this.value);
    this.rawValue = this.beautify(this.rawValue);
  },

  methods: {

    isJson (test) {
      try {
        JSON.parse(test);
        return true;
      } catch (e) {
        return false;
      }
    },

    fix () {
      this.rawValue = this.beautify(this.rawValue);
    },

    beautify (text) {
      var beautify_js = require('js-beautify').js_beautify;

      return text ? beautify_js(text, { indent_size: 4 }) : '';
    },

    onCursorActivity ($event) {
      this.doc = $event.doc;
    },

    onInput ($event) {
      if (this.isJson($event)) {
        this.$emit('input', JSON.parse($event));
        // $event = this.beautify($event);

        var pos_original = this.doc.getCursor();

        // this.rawValue = $event;
        // var pos_new = this.doc.getCursor();
        // console.log(pos_original.line, pos_original.ch);
        // this.doc.setCursor(pos_original.line, pos_original.ch);
      }

      //
    }
  }
}

</script>
<style>
.editor .CodeMirror {
height: 700px;
}

.editor iframe {
height: 700px;
}

.editor iframe {
overflow-y: scroll;
min-height: 0;
}

.editor {
height: 700px;
}
.editor > * {
height:auto !important;

}
</style>
