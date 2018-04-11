<template>
    <div>
        <div class='form-group' v-bind:class="{error: error}">
            <input type='text' class='form-control' placeholder=' ' v-model='_value' v-on:input="onChange()">
            <span class="form-highlight"></span>
            <label>{{ attribute.label }}</label>
        </div>

        <div class="error" v-if="error">{{ $t("API_" + error.code) }}&nbsp;</div>
    </div>
</template>
<script>

export default {
    props: ['value', 'error', 'attribute', 'errors'],
    methods: {
        onChange: function() {

            this.$emit("input", this._value);
        },
       
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
        this._value =  this.value;
        if (!this.attribute.label) {
            this.attribute.label = this.$t(this.attribute.name);
        }
    }
}

</script>