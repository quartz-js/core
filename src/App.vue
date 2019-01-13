<template>
  <div id="app">
    <div id="container">
      <p>Text</p>
      <q-text :attribute="newBaseAttribute('foo')" v-model="resource" :errors="[]"></q-text>
      <p>Switch</p>
      <q-switch :attribute="newSwitchAttribute('foo')" v-model="resource" :errors="[]"></q-switch>
    </div>
  </div>
</template>

<script>

import { Attributes } from '@'

export default {
  name: 'app',
  data() {
    return {
      resource: { foo: '1'}
    }
  },
  methods: {
    newBaseAttribute(name) {
      return new Attributes.Base(name);
    },
    newSwitchAttribute(name) {
      return new Attributes.Base(name);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
