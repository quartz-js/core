<template>
  <div v-if="show && attribute && !loading" class="mt-4">
    <div v-if="!display && (!rawValue || !rawValue.id)">
      <a href="javascript:;" @click="display = !display">Display {{ this.getResourceTitle(attributeConfig()) }}</a>
    </div>
    <div v-else>
      <component v-if="!rawValue && components.create" v-bind:is="components.create" :config="attributeConfig()" :hooks="prepareHooks()" :resource="rawValue" flat type='direct' v-bind="$attrs"/>
      <component v-if="rawValue && components.update" v-bind:is="components.update" :config="attributeConfig()" :hooks="prepareHooks()" :resource="rawValue" flat type='direct' v-bind="$attrs"/>
    </div>
  </div>
</template>
<script>

import { BelongsToAttribute } from '../../attributes/BelongsToAttribute'
import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'

export default {
  mixins: [
    AttributePreMount,
    ResourceLocalization
  ],
  props: {
    value: {
      required: true,
    },
    attribute: {
      type: BelongsToAttribute,
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
      display: false,
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

    this.display = this.attribute.required

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

    if (this.attribute.getCreateComponent()) {
      this.components.create = this.attribute.getCreateComponent().component;

    }

    if (this.attribute.getUpdateComponent()) {
      this.components.update = this.attribute.getUpdateComponent().component;
    }

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