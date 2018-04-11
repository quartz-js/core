<template>
    <div>
        <div v-on-clickaway="fade" class='select'>
            <div class='form-group ' v-bind:class="{error: error}" >
                <input type='hidden' v-model='_value' v-on:input="onChangeValue()">
                <input type='text' class='form-control' placeholder=' ' v-model='query' v-on:focus="visible = true;onChange()" v-on:input="onChange()">
                <span class="form-highlight"></span>
                <label>{{ attribute.label }}</label>
            </div>

            <div v-if='visible' class='paper window'>
                <div v-for='option in resources' class='nav-link text-link text-link-router' v-on:click="onSelect(option)">
                    {{ option.label }}
                </div>
                <div class='info'>
                    {{ total }} results
                </div>
            </div>
        </div>
        <div class="error" v-if="error">{{ $t("API_" + error.code) }}&nbsp;</div>
    </div>
</template>
<script>

import { mixin as clickaway } from 'vue-clickaway';

export default {
    props: ['value', 'attribute', 'error', 'errors'],
    mixins: [ clickaway ],
    data: function() {
        return {
            visible: false,
            resources: null,
            query: null,
            total: 0,
        }
    },

    methods: {
        onChangeValue: function() {
            // this.$emit("input", this._value);
        },

        onChange: function() {

            var self = this;
            this.data = null;
            clearTimeout(self.timeout);
            self.timeout = setTimeout(self.onLoad, 100)


        },

        onSelect: function(option) {
            this.query = option.label;
            this._value = option.value;
            this.$emit("input", this._value);
            this.fade();
        },

        onLoad: function() {

            var self = this;
            var query = this.query;

            var totals = query ? this.attribute.options.filter(function(value) {
                return value.label.includes(query);
            }) : this.attribute.options;

            this.total = totals.length;
            this.resources = totals.slice(0, 3);

        },
        fade: function() {
            this.visible = false;
        }
       
    },
    watch: {
        errors: function(val, oldVal) {

            var self = this;

            if (this.errors.length) {
                this.error = this.errors.find(function(error) { 
                    return error.label === self.attribute.name; 
                });
            }
        }
    },
    mounted() {
    },
    created () {

        this._value =  this.value;
        var self = this;

        if (!this.attribute.label) {
            this.attribute.label = this.$t(this.attribute.name);
        }

        if (this._value) {
            var res = this.attribute.options.filter(function(option) {
                return option.value === self._value;
            });

            if (res.length > 0) {
                this.query = res[0].label;
            }
        }


    }
}

</script>
<style scoped>

    .select {
        position: relative;
        font-size: 14px;
    }

    .select .window {
        position: absolute;
        left:0;
        right: 0;
        margin-top: -5px;
        text-align: left;
        z-index: 5;
    }
    .dropdown {
        cursor: pointer;
        font-size: 19px;
    }

    .info {
        font-size: 11px;
        padding: 20px;
        border-top: 1px solid #efefef;
    }
</style>
