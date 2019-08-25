<template>
  <div>
    <q-select
      v-model="rawValue"
      :items="items"
      v-bind='attributes'
      v-on='$listeners'
      multiple
      :hide-details="true"
      @change="$emit('input', {value: rawValue, components: components})"
    ></q-select>
  </div>
</template>
<script>

import QElement from './QElement'
import _ from 'lodash'

export default {
  mixins: [QElement],
  props: {
    value: {},
    type: {
      type: String,
      default: 'select'
    },
    items: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      rawValue: null
    }
  },
  computed: {
    components: function() {
      let values = Array.isArray(this.rawValue) ? this.rawValue : []

      return values.map(k => {
        return this.items.find(i => {
          return i.value == k
        })
      })
    }
  },
  mounted() {
    this.rawValue = this.value;

    if (this.rawValue) {
      this.$emit('input', {value: this.rawValue, components: this.components})
    }
  },
  methods: {
    isMultiple() {
      return this.getOptions().multiple
    },
    getOptions() {
      let opts = {
        select: {
          multiple: false
        },
        selectMultiple: {
          multiple: true
        },
        tab: {
          multiple: false
        },
        all: {
          multiple: true
        }
      }

      return this.opts[this.type]
    }
  }
}
</script>