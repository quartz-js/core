<template>
  <div v-if="attribute && this.canShow()">
    <div v-if="!attribute.style.form">
      <q-autocomplete
          :loading="loading"
          :items="items"
          item-text="label"
          :label="label !== undefined ? label : attribute.label"
          :hint="hint !== undefined ? hint : getAttributeDescription(attribute)"
          v-model="rawValue"
          @input="onChange"
          :search-input="search"
          :search-input.sync="search"
          return-object
          editable
          multiple
          hide
          clearable
        >
        <template v-slot:item="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
          </template>
          <template v-else>
            <v-list-item-avatar v-if="data.item.avatar">
              <img :src="data.item.avatar">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="data.item.label"></v-list-item-title>
            </v-list-item-content>
          </template>
        </template>
        <template
            slot="selection"
            slot-scope="data"
          >
        </template>
      </q-autocomplete>
      <div class="mb-3" >
        <v-chip 
          class="chip--select-multi"
          label
          :color="randomColor(item.label)" 
          text-color="white" 
          v-for="item in rawValue"
          close 
          @input="remove(item)"
        >
          <v-avatar v-if="item.avatar" label tile>
            <img src="http://i.pravatar.cc/64">
          </v-avatar>
          #{{ item.id }} - {{ item.label }}
        </v-chip>
      </div>
    </div>
    <div v-if="attribute.style.form && attribute.style.form.name === 'checker'">
      <p class="mt-3">{{ attribute.label }}</p>
      <div v-if="attribute.style.form.grouped_by">
        <div v-for="items in groupedItems">
          <p>{{ items.key }}</p>
          <v-checkbox v-for="item in items.items" v-model="rawValueIds[item.id]" :label="item.label" @change="update($event, item.id)"></v-checkbox>
        </div>
      </div>
      <div v-else>
        <v-checkbox v-for="item in items" v-model="rawValueIds[item.id]" :label="item.label" @change="update($event, item.id)"></v-checkbox>
      </div>
      <div v-if="items.length === 0">
        No results found to relate
      </div>
    </div>
  </div>
</template>
<script>

import _ from 'lodash'
import { MorphToMany } from '../../app/Relations/MorphToMany'
import { AttributePreMount } from '../../mixins/AttributePreMount'
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
import ColorHash from 'color-hash'

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
      type: MorphToMany,
      required: true
    },
    errors: {
      required: true
    },
    label: {
      default: undefined
    },
    hint: {
      default: undefined
    }
  },
  data: function () {
    return {
      rawValue: [],
      rawValueIds: {},
      loading: false,
      search: '',
      groupedItems: {},
      items: [],
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

    if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {
      this.querySelections(''); 
    } 
    if (val === null && this.value[this.name] !== null) {
      this.loading = true;
      this.attribute.load([this.value]).then((data) => {
        this.loading = false;
        this.loadByVal(this.attribute.extractValue(this.value));
      });
    } else if (val) {
      this.loadByVal(val);
    } else {
      this.querySelections();
    }
  },
  watch: {
    value: {
      handler: function (){

        this.loadByVal(this.attribute.extractValue(this.value));

        if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {
          this.querySelections(''); 
        }

      },
      deep: true
    },
    search (newVal) {
      (!this.rawValue || (this.rawValue && newVal !== this.rawValue.label)) && this.querySelections(newVal)
    },
  },
  methods: {
    randomColor (str) {

      if (!str) {
        return str;
      }

      var customHash = function(str) {
          var hash = 0;
          for(var i = 0; i < str.length; i++) {
              hash += str.charCodeAt(i);
          }
          return hash;
      };

      return new ColorHash({hash: customHash, lightness: [0.5], saturation: [0.65]}).hex(str);
    },
    remove (item) {
      const index = this.rawValue.findIndex(r => {
        return item.id = r.id;
      });

      if (index >= 0) {
        this.rawValue.splice(index, 1)
      }
    },
    attributeConfig() {
      var t = this.attribute.getRelationManager(this.value).clone();
      t.onUpdateSuccess = (vue, response) => {
        this.unload(response.body.data);
      }
      t.onCreateSuccess = (vue, response) => {
        this.unload(response.body.data);
      }
      return t;
    },
    unload(data) {
      this.loadByVal(data);
      this.onChange();
    },
    loadByVal (val) {
      if (val && val.length > 0) {
        val = val.filter(resource => { return resource});

        val.map(resource => {
          return resource.label = this.attribute.getLabelByResource(resource, this.value)
          
          this.items.push(resource);
        })

        val.map(resource => {
          this.rawValueIds[resource.id] = true;
        })

        this.rawValue = val;
      } else {
        this.rawValue = [];
        this.rawValueIds = {};
      }

    },
    querySelections (v) {
      this.loading = true;

      if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {
        v = null;
      }

      this.lastRawValue = this.rawValue

      let params = this.attribute.filterIndexerParams({
        query: v, 
        value: this.value
      });

      this.attribute.executeHooks('include', params.include ? params.include : []).then(includes => {
        params.include = includes.join(",");
        return this.attribute.indexerApi.index(params)
      }).then(response => {
          this.items = response.body.data.map((item) => {
            item.label = this.attribute.getLabelByResource(item, this.value);
            delete item['pivot'];
            return item;
          });

          if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {
              
            let rawValueIds = this.rawValueIds;

            this.items.map(resource => {
              if (typeof rawValueIds[resource.id] == 'undefined') {
                rawValueIds[resource.id] = false;
              }
            });

            this.rawValueIds = rawValueIds;
          }

          if (this.attribute.style.form && this.attribute.style.form.grouped_by) {
            var groupedItems = {};

            this.items.map(item => {
              if (item[this.attribute.style.form.grouped_by]) {
                let key = item[this.attribute.style.form.grouped_by].name;

                if (typeof groupedItems[key] === "undefined") {
                  groupedItems[key] = {
                    key: key,
                    items: []
                  }
                }

                groupedItems[key].items.push(item);
              }
            });
            this.groupedItems = Object.values(groupedItems);
          }
        })
        .finally(() => { this.loading = false});
    },
    update: function ($status, id)
    {
      this.onChange();
    },
    onChange: function () {

      if (!this.rawValue) {
        this.rawValue = [];
      }

      if (this.attribute.style.form && this.attribute.style.form.name === 'checker') {

        this.rawValue = Object.keys(_.pickBy(this.rawValueIds, r => {
          return r;
        })).map(id => {
          return this.items.find(item => {
            return item.id == id
          })
        })
      }

      this.query = this.attribute.mutator(this.rawValue);

      this.attribute.injectValue(this.value, this.rawValue);

      this.$emit('input', this.value);

    },

  }
}

</script>
<style scoped>
.layout > * {
  margin: 0;
}
</style>