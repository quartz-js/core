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
          @input="onChange()">
        <span class="form-highlight"/>
        <label>{{ attribute.label }}</label>
      </div>

      <div
        v-if="visible"
        class="paper window">
        <div v-if="data">
          <div
            v-for="resource in data.resources"
            class="select-link text-link text-link-router"
            @click="onSelect(resource)">
            {{ attribute.getLabelByResource(resource) }}
          </div>
          <div class="info">
            {{ data.pagination.total }} results
          </div>
        </div>
        <div
          v-else
          class="content">
          Loading...
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
  props: ['value', 'attribute', 'errors'],
  data: function () {
    return {
      error: null,
      visible: false,
      data: null,
      query: null
    }
  },
  watch: {
    errors: function (val, oldVal) {
      var self = this;

      if (this.errors.length) {
        this.error = this.errors.find(function (error) {
          return error.label === self.attribute.extractValue(this.value); ;
        });
      }
    }
  },
  mounted () {
  },
  created () {
    this.rawValue = this.value;
    var self = this;

    if (!this.attribute.label) {
      this.attribute.label = this.$t(this.attribute.name);
    }

    if (this.rawValue) {
      this.query = this.attribute.mutator(this.attribute.extractValue(this.value));
    }
  },

  methods: {
    onChangeValue: function () {
      // this.$emit("input", this.rawValue);
    },

    onChange: function () {
      var self = this;
      this.data = null;
      clearTimeout(self.timeout);
      self.timeout = setTimeout(self.onLoad, 100)
    },

    onSelect: function (resource) {
      this.query = this.attribute.mutator(resource);

      this.attribute.injectValue(this.value, resource.id);
      this.$emit('input', this.value);
      this.fade();
    },

    onLoad: function () {
      var query = this.query ? this.attribute.executeQuery(this.query) : '';

      this.attribute.api.index({show: 5, query: query}).then(response => {
        this.data = response.body;

        this.error = null;

        if (this.data.resources.length === 0) {
          this.error = {
            code: 'NOT_FOUND'
          };
        }
      });
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
