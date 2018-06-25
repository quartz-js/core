<template>
    <div>
        <div class='form-group' v-bind:class="{error: error}">
            <input type='password' class='form-control' placeholder=' ' v-model='rawValue' v-on:input="onChange()" autocomplete="off">
            <span class="form-highlight"></span>
            <label>{{ attribute.label }}</label>
        </div>
        <div class='description'>{{ $t(attribute.description) }}</div>
        <div class="error" v-if="error">{{ $t("API_" + error.code) }}&nbsp;</div>
    </div>
</template>
<script>

export default {
    props: ['value', 'error', 'attribute', 'errors'],
    methods: {
        onChange: function() {
            this.attribute.injectValue(this.value, this.rawValue);
            this.$emit("input", this.rawValue);
        },
       
    },
    data() {
        return {
            rawValue: null,
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
        this.rawValue = this.attribute.extractValue(this.value);

        if (!this.attribute.label) {
            this.attribute.label = this.$t(this.attribute.name);
        }
    }
}

</script>