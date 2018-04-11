<template>

    <div>
        <div class='content'>
            <h3>{{ config.title }}</h3>
        </div>    

        <resource-index-query :query='query' :error='errors.search' @on-change-query="onChangeQuery"/>

        <div class='fluid fluid-vcenter'>
            <div class='content'>{{ $t('selected') }}: {{ selected.filter(function(v) { return v;}).length }}</div>
            <div class='w10'></div>
            <div class='fluid v-bind:class="{hide: selected.filter(function(v) { return v;}).length > 0}"'>   
                
                <button class='btn btn-sm btn-danger icon-circle' v-b-modal.delete>
                    <i class='fa fa-trash'></i>
                </button>
                <div class='w10'></div>
                <button class='btn btn-sm btn-primary icon-circle' style='opacity:0.3'>
                    <i class='fa fa-pencil-alt'></i>
                </button>
            </div>
            <div class='fill'></div>
            <div>
                <resource-index-pagination v-if='data' :pagination='pagination' @on-change-pagination="onChangePagination"/>
            </div>
        </div>

        <div v-if='data'>
            <table class='table' v-if='attributes'>
                <tr>
                    <td class='col-head'> 
                        <div class="pretty p-default">
                            <input type="checkbox" v-on:change="updateAllSelected($event)"/>
                            <div class="state p-primary-o">
                                <label></label>
                            </div>
                        </div>
                    </td>
                    <td v-for="attribute in attributes" v-if="cols[attribute.name].enabled" class='col-head'> {{ attribute.label }} </td>
                    <td class='actions'>
                        <select-checkbox v-model='cols'></select-checkbox>
                    </td>
                </tr>
                <tr v-for="(resource, key) in data.resources">
                    <td>
                        
                        <div class="pretty p-default">
                            <input type="checkbox" v-model="selected[key]"/>
                            <div class="state p-primary-o">
                                <label></label>
                            </div>
                        </div>
                    </td>
                    <td v-for="attribute in attributes" v-if="cols[attribute.name].enabled">{{ attribute.extractValue(resource) }}</td>
                    <td class='actions'>
                        <div class='fluid fluid-right'>
                            <router-link :to="{ name: config.route+'.show', params: { id: resource.id }}" class='btn btn-sm btn-primary icon-circle' v-if="config.show">
                                <i class='fa fa-eye'></i>
                            </router-link>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="spinner" v-if='!data'></div>

        <resource-index-pagination v-if='data' :pagination='pagination' @on-change-pagination="onChangePagination"/>

        <b-modal id="delete" ref="delete" hide-footer :title="$t('removing')">
            <div class="d-block text-center">
                <p>{{ $t('irreversible_operation')}} <br><br>{{ $t('are_you_sure')}}</p>
            </div>
            <b-btn class="mt-3" variant="outline-danger" block @click="hideModal(); removeSelected();">{{ $t('yes')}}</b-btn>
            <b-btn class="mt-3" variant="outline-primary" block @click="hideModal(); ">{{ $t('no')}}</b-btn>
        </b-modal>
    </div>
</template>

<script>

import { ResourceIndex } from '../../mixins/ResourceIndex'

export default {
    mixins: [ResourceIndex],
    props: ['config'],
    created() {
        this.manager = this.config.manager;
        this.attributes = this.config.attributes;

        for (var i in this.attributes) {
            var attribute = this.attributes[i];

            this.cols[attribute.getName()] = { name: attribute.name, value: attribute.name, label: attribute.label, enabled: true};
        }
    }
}
</script>