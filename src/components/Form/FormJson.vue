<template>

  <div>
    <codemirror
      :value="rawValue"
      :options="options"
      @input="onInput($event)"
      @cursorActivity="onCursorActivity"
      @blur = "fix"
      class=""
      v-bind:class="{'error' : error }"

    />
  <div v-if="error" class='alert alert-danger error-text content'>
    An error has been detected in your json. Please fix it before saving
  </div>
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
      error: false,
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
        this.error = false;
      } catch (e) {
        this.error = true;
      }
      return !this.error;
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
<style scoped>
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

.vue-codemirror {
  border: 2px solid #232f35
}

.vue-codemirror.error {
  border: 2px solid #dc3545;
}

</style>
