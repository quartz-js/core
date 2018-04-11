<template>

    <dropdown>
        <template slot='activator'>
        <i class='fa fa-list dropdown'></i>
        </template>
        <template slot='window'>
        <div class='content'>
            <div v-for='(option, key) in value' :for="'select-'+key" class='element'>

                <div class="pretty p-default">
                        <input type="checkbox"  v-on:change="updateValue($event)" :value='option.value' :checked="option.enabled"/>
                        <div class="state p-primary-o">
                          <label>{{ option.label }}</label>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </dropdown>

</template>

<script>

import { mixin as clickaway } from 'vue-clickaway';
require('pretty-checkbox/dist/pretty-checkbox.min.css');

export default {

  mixins: [ clickaway ],
  props: [ "value"],
  data: function() {
    return {
        visible: false
    }
  },

  methods: {
    updateValue: function($event) {
        this.value[$event.target.value].enabled = $event.target.checked;
        this.$emit("input", JSON.parse(JSON.stringify(this.value)));
    },
    fade: function() {
        this.visible = false;
    }
  },
}

</script>

<style scoped>
    .select {
        position: relative;
        font-size: 14px;
    }
    .select .window {
        position: absolute;
        right: 0;
        text-align: left;
        z-index: 5;
    }
    .dropdown {
        cursor: pointer;
        font-size: 19px;
    }
</style>
