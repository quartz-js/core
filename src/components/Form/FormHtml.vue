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
require('codemirror/lib/codemirror.css')
require('codemirror/theme/material.css')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/mode/htmlmixed/htmlmixed.js')

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
  watch: {
    value: function (){
      this.reloadRawValue();
    }
  },
  mounted () {
    this.rawValue = this.beautify(this.value ? this.value : '');
  },

  methods: {
    reloadRawValue() {
      this.rawValue = this.beautify(this.value);
    },

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
    }
  }
}

</script>
<style>