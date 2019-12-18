<template>
  <div>
    <codemirror
      :value="rawValue"
      :options="options"
      @input="onInput($event)"
      v-on="$listeners"
      @cursorActivity="onCursorActivity"
      @blur = "fix"
      :style="'height:'+height+'px'"
    />
  </div>
</template>

<script>

import { codemirror } from 'vue-codemirror'
require('codemirror/lib/codemirror.css')
require('codemirror/theme/material.css')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/mode/yaml/yaml.js')

export default {
  components: {
    codemirror
  },

  props: ['json', 'value', 'height'],
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