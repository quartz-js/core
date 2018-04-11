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
                <div v-if='data'>
                    <div v-for='resource in data.resources' class='nav-link text-link text-link-router' v-on:click="onSelect(resource)">
                        {{ attribute.getLabelByResource(resource) }}
                    </div>
                    <div class='info'>
                        {{ data.pagination.total }} results
                    </div>
                </div>
                <div v-else class="content">
                    Loading...
                </div>
            </div>
        </div>
        <div class="error" v-if="error">{{ $t("API_" + error.code) }}&nbsp;</div>
    </div>
</template>
<script>

import { mixin as clickaway } from 'vue-clickaway';

export default {
    props: ['value', 'attribute', 'errors'],
    mixins: [ clickaway ],
    data: function() {
        return {
            error: null,
            visible: false,
            data: null,
            query: null,
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

        onSelect: function(resource) {
            this.query = this.attribute.getLabelByResource(resource);
            this._value = resource.id;
            this.$emit("input", this._value);
            this.fade();
        },

        onLoad: function() {

            var query = this.query ? this.attribute.executeQuery(this.query) : '';

            this.attribute.api.index({show: 5, query: query}).then(response => {
                this.data = response.body;

                this.error = null;

                if (this.data.resources.length === 0) {
                    this.error = {
                        code: "NOT_FOUND"
                    };
                }
            });
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
            this.attribute.api.show(this._value).then(response => {
                this.query = this.attribute.getLabelByResource(response.body.resource);
            })
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
