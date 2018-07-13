<template> 
 
    <dropdown> 
        <template slot='activator'> 
            <slot name='activator'><i class='fa fa-list dropdown'></i></slot> 
        </template> 
        <template slot='window'> 
            <div> 
                <div v-for='(option, key) in value' :for="'select-'+key" class='element selector' v-on:click="onClick(option, key)"> 
 
                    <div class="pretty p-icon p-toggle p-plain p-smooth"> 
                        <input type="checkbox" :ref="'select-'+key" :value='option.value' :checked="option.enabled"/> 
                        <div class="state p-on"> 
                            <i class="icon fa fa-check"></i> 
                            &nbsp; 
                            <label>{{ option.label }}</label> 
                        </div> 
                        <div class="state p-off"> 
                            &nbsp; 
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
    onClick: function(option, key) { 
        this.value[key].enabled = !this.value[key].enabled; 
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

    .selector {
      padding: 10px 15px;
      cursor: pointer;
    }
 
</style>