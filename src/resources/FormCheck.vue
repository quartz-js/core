<template>
  <div>
    <div
      v-on-clickaway="fade"
      class="select">
      <div
        :class="{error: error}"
        class="form-group " >
        <input
          v-model="rawValue"
          type="hidden"
          @input="onChangeValue()">
        <input
          v-model="query"
          type="text"
          class="form-control"
          placeholder=" "
          @focus="visible = true;onChange()"
          @blur="hide"
          @input="onChange()">
        <span class="form-highlight"/>
        <label>{{ attribute.label }}</label>
      </div>

      <div
        v-if="visible"
        class="paper window">
        <div
          v-for="option in resources"
          class="select-link text-link text-link-router"
          @click="onSelect(option)">
          {{ option.label }}
        </div>
        <div class="info">
          {{ total }} results
        </div>
      </div>
    </div>
    <div
      v-if="error"
      class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import { mixin as clickaway } from 'vue-clickaway';

export default {
  mixins: [ clickaway ],
  props: ['value', 'attribute', 'error', 'errors'],
  data: function () {
    return {
      visible: false,
      resources: null,
      query: null,
      rawValue: null,
      total: 0
    }
  },
  watch: {
    errors: function (val, oldVal) {

      if (this.errors.length) {
        this.error = this.errors.find((error) => {
          return error.label === this.attribute.name;
        });
      }
    }
  },
  mounted () {
  },
  created () {

    if (!this.attribute.label) {
      this.attribute.label = this.$t(this.attribute.name);
    }

    var option = this.attribute.extractValue(this.value);

    this.rawValue = null;

    if (option) {
      this.query = option.label;
      this.rawValue = option.value;
    }
  },

  methods: {
    onChangeValue: function () {
      // this.$emit("input", this.rawValue);
    },

    onChange: function () {
      this.data = null;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.onLoad, 100)
    },

    onSelect: function (option) {
      this.query = option.label;
      this.rawValue = option.value;

      this.attribute.injectValue(this.value, option.value);

      this.$emit('input', this.rawValue);
      this.fade();
    },

    hide: function () {
      setTimeout(() => {
        this.visible = false;
      }, 100);
    },
    onLoad: function () {
      var query = this.query;

      var totals = query ? this.attribute.options.filter(function (value) {
        return value.label.includes(query);
      }) : this.attribute.options;

      this.total = totals.length;
      this.resources = totals.slice(0, 10);
    },
    fade: function () {
      this.visible = false;
    }

  }
}

</script>
<style scoped>

.select {
  position: relative;
  font-size: 14px;
}

.select .window {
  position: absolute;
  left:0;
  right: 0;
  margin-top: -5px;
  text-align: left;
  z-index: 5;
}

.dropdown {
  cursor: pointer;
  font-size: 19px;
}

.info {
  font-size: 11px;
  padding: 20px;
  border-top: 1px solid #efefef;
}

.select-link {
  padding: 15px 20px;
}

.select-link:hover {
  background: #616ad9;
  color: white;
}
</style>
