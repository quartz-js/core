<template>
    <div>

        <div class='form-group' >
            <label>{{ attribute.label }}</label>
            <div class='container-switch'>
                <switches v-model="rawValue" v-on:input="onChange()" type-bold="true" theme="bootstrap" color="primary"></switches>
            </div>
        </div>
    </div>
</template>
<script>

import Switches from 'vue-switches';

export default {
    props: ['value', 'error', 'attribute', 'errors'],
    components: {
        Switches
    },
    methods: {
        onChange: function() {
            var index = this.rawValue ? 1 : 0;
            this.attribute.injectValue(this.value, index);

            this.$emit("input", this.value);
            this.$forceUpdate();
        },
       
    },
    data () {
        return {
            rawValue: false
        }
    },
    mounted() {
            
        var self = this;

        if (this.errors) {
            this.error = this.errors.find(function(error) { 
                return error.label === self.attribute.name; 
            });
        }
    },
    created () {

        var self = this;

        if (!this.attribute.label) {
            this.attribute.label = this.$t(this.attribute.name);
        }

        var option = this.attribute.extractValue(this.value);
        this.rawValue = option.value;
    }
}

</script>
<style scoped>
    .container-switch {
        padding-top: 10px;
        padding-left: 5px;
        position: relative;
    }
</style>
