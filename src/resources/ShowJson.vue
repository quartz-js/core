<template>
    <div>
        <div class='form-group'>
            <label class='label-show'>{{ attribute.label }}</label>
            <div id='json' ref='json'></div>
        </div>
    </div>
</template>
<script>

import JSONFormatter from 'json-formatter-js'

export default {
    props: ['value', 'error', 'attribute', 'errors'],
    methods: {
        onChange: function() {

            this.$emit("input", this.rawValue);
        },
       
    },
    created () {
        this.rawValue =  this.value;
        var self = this;

        if (!this.attribute.label) {
            this.attribute.label = this.$t(this.attribute.name);
        }
        
    },

    mounted: function() {
        const formatter = new JSONFormatter(this.rawValue);
        this.$refs.json.appendChild(formatter.render());
    }
}

</script>