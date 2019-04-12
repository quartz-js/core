<template>
  <div class="mt-4">
    <div v-if="show && attribute && !loading">
      <component v-if="!rawValue && components.create" v-bind:is="components.create" :config="attributeConfig()" :hooks="prepareHooks()" :resource="rawValue" flat type='direct'v-bind="$attrs"/>
      <component v-if="rawValue && components.update" v-bind:is="components.update" :config="attributeConfig()" :hooks="prepareHooks()" :resource="rawValue" flat type='direct'v-bind="$attrs"/>
      <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
    </div>
  </div>
</template>
<script>

import { HasOneMorph } from '../../relations/HasOneMorph'
import { AttributePreMount } from '../../mixins/AttributePreMount'

export default {
  mixins: [
    AttributePreMount
  ],
  props: {
    value: {
      required: true,
    },
    attribute: {
      type: HasOneMorph,
      required: true
    },
    errors: {
      required: true
    }
  },
  data: function () {
    return {
      loading: false,
      rawValue: null,
      components: {
        create: null,
        update: null
      }
    }
  },
  mounted () {

    if (!this.canMount()) {
      return;
    }

    var val = this.attribute.extractValue(this.value);


    if (val === null && this.value[this.name] !== null) {
    
      this.loading = true;

      this.attribute.load([JSON.parse(JSON.stringify(this.value))]).then((data) => {
        this.onChange(this.attribute.extractValue(data[0]));
        this.loading = false;
      });
    } else {
      this.loadByVal(val);
    }

    this.components.create = this.attribute.component.getCreateComponent().component;
    this.components.update = this.attribute.component.getUpdateComponent().component;

  },
  watch: {
    value: {
      handler: function (){
        this.loadByVal(this.attribute.extractValue(this.value));
      },
      deep: true
    }
  },
  methods: {
    attributeConfig() {
      return this.attribute.relationManager();
    },
    loadByVal (val) {
      this.rawValue = JSON.parse(JSON.stringify(val));
    },
    onChange: function (val) {

      if (JSON.stringify(val) == JSON.stringify(this.rawValue)) {
        return 
      }

      this.attribute.injectValue(this.value, val);
    
      this.$emit('input', this.value);

    },
    prepareHooks () {
      return {
        OnChange: [
          (data) => {
            this.onChange(JSON.parse(JSON.stringify(data.resource)));
          }
        ]
      }
    }
  }
}

</script>
<style scoped>
.layout > * {
  margin: 0;
}
</style>