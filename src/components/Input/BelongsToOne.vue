s<template>
  <div v-if="show && attribute">

    <component v-if="!rawValue && components.create" v-bind:is="components.create" :config="attributeConfig()" :hooks="prepareHooks()" :resource="rawValue" flat type='direct'/>

    <component v-if="rawValue && components.update" v-bind:is="components.update" :config="attributeConfig()" :hooks="prepareHooks()" :resource="rawValue" flat type='direct'/>
      
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import { BelongsToAttribute } from '../../attributes/BelongsToAttribute'
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
      type: BelongsToAttribute,
      required: true
    },
    errors: {
      required: true
    }
  },
  data: function () {
    return {
      finalValue: {},
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
      this.attribute.load([this.value]).then((data) => {
        this.loading = false;
        this.loadByVal(this.attribute.extractValue(this.value));

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

    this.attribute.addHook('BeforeCreate', (data) => {

      if (!this.finalValue || !this.finalValue.id) {
        return this.attribute.resourceConfig.createResource(this.finalValue)
          .then(response => {

            data.resource[this.attribute.name] = response.body.data.id
            this.finalValue.id = response.body.data.id;

            return data
          })
      } else {
        return this.attribute.resourceConfig.updateResource(this.finalValue.id, this.finalValue)
          .then(response => {

            data.resource[this.attribute.name] = response.body.data.id
            this.finalValue.id = response.body.data.id;

            return data
          })
      }
    });


  },
  watch: {
    value: function (){
      this.rawValue = this.attribute.extractValue(this.value);
    },
  },
  methods: {
    attributeConfig() {
      return this.attribute.resourceConfig;
    },
    loadByVal (val) {
      this.rawValue = val;
    },
    onChange: function (val) {


      this.query = this.attribute.mutator(this.rawValue);

      this.attribute.injectValue(this.value, this.rawValue);
  
      this.$emit('input', this.rawValue);

    },
    prepareHooks () {
      return {
        OnChange: [
          (data) => {
            this.finalValue = JSON.parse(JSON.stringify(data.resource));
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