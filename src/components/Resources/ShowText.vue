<template>
    <div>
        <div class='form-group'>
            <label class='label-show'>{{ attribute.label }}</label>
            <span class='show-value'>
                {{ _value }}
            </span>
        </div>
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
    created () {
        this._value =  this.value;
        var self = this;

        if (!this.attribute.label) {
            this.attribute.label = this.$t(this.attribute.name);
        }
        
    }
}

</script>