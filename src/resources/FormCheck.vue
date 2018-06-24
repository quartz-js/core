<template>
    <div>
        <div v-on-clickaway="fade" class='select'>
            <div class='form-group ' v-bind:class="{error: error}" >
                <input type='hidden' v-model='rawValue' v-on:input="onChangeValue()">
                <input type='text' class='form-control' placeholder=' ' v-model='query' v-on:focus="visible = true;onChange()" v-on:blur="hide" v-on:input="onChange()">
                <span class="form-highlight"></span>
                <label>{{ attribute.label }}</label>
            </div>

            <div v-if='visible' class='paper window'>
                <div v-for='option in resources' class='select-link text-link text-link-router' v-on:click="onSelect(option)">
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
            rawValue: null,
            total: 0,
        }
    },

    methods: {
        onChangeValue: function() {
            // this.$emit("input", this.rawValue);
        },

        onChange: function() {

            var self = this;
            this.data = null;
            clearTimeout(self.timeout);
            self.timeout = setTimeout(self.onLoad, 100)

        },

        onSelect: function(option) {
            this.query = option.label;
            this.rawValue = option.value;


            this.attribute.injectValue(this.value, option.value);


            this.$emit("input", this.rawValue);
            this.fade();
        },

        hide: function() {
            var self = this;
            setTimeout(function() {
                self.visible = false;
            }, 100);
        },
        onLoad: function() {

            var self = this;
            var query = this.query;

            var totals = query ? this.attribute.options.filter(function(value) {
                return value.label.includes(query);
            }) : this.attribute.options;

            this.total = totals.length;
            this.resources = totals.slice(0, 10);

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

        var self = this;

        if (!this.attribute.label) {
            this.attribute.label = this.$t(this.attribute.name);
        }

        var option = this.attribute.extractValue(this.value);

        this.rawValue = null;
        
        if (option) {
            this.query = option.label;
            this.rawValue = option.value;
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
    .select-link {
        padding: 15px 20px;
    }

    .select-link:hover {
        background: #616ad9;
        color: white;
    }
</style>
