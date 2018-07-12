<template>
  <div>
    <div class="fluid">
      <div class="page-section paper">

        <div class="relative">
          <div class="resource-index-head"><h3>{{ config.title }}</h3></div>

          <div class="button-edit">
            <router-link
              v-if="config.create"
              :to="{ name: config.route + '.create' }"
              class="btn btn-primary"><i class="fa fa-plus"/></router-link>
          </div>

          <resource-index-query
            :query="query"
            :error="errors.search"
            @on-change-query="onChangeQuery"/>
          <div v-if="data">
            <div v-if="data.resources.length === 0">
              <no-results/>
            </div>
            <div v-if="data.resources.length > 0">
              <div class="fluid fluid-vcenter">
                <div class="content">{{ $t('total_results', { total: data.pagination.total }) }}, {{ $t('selected') }}: {{ selected.filter(function(v) { return v;}).length }}</div>
                <div class="w10"/>
                <div :class="{ 'hide': selected.filter(function(v) { return v;}).length === 0}">
                  <div class="fluid">

                    <button
                      v-b-modal="'delete-'+config.route"
                      class="btn btn-sm btn-danger icon-circle" >
                      <i class="fa fa-trash"/>
                    </button>
                    <div class="w10"/>
                    <button
                      class="btn btn-sm btn-primary icon-circle"
                      style="opacity:0.3">
                      <i class="fa fa-pencil-alt"/>
                    </button>
                  </div>
                </div>
                <select-checkbox v-model="cols">
                  <template slot="activator">
                    Edit columns (wip)
                  </template>
                </select-checkbox>
                <div class="fill"/>
                <div>
                  <resource-index-pagination
                    v-if="data"
                    :pagination="pagination"
                    @change="onChangePagination"/>
                </div>
              </div>

              <table
                v-if="attributes"
                class="table">
                <tr>
                  <td class="table-column-select">
                    <div class="pretty p-default ">
                      <input
                        type="checkbox"
                        @change="updateAllSelected($event)">
                      <div class="state p-primary-o">
                        <label/>
                      </div>
                    </div>
                  </td>

                  <slot
                    :sort="sort"
                    :getAttributes="getAttributes"
                    :showAttribute="showAttribute"
                    :onSort="onSort"
                    name="head">
                    <resource-index-sort
                      v-for="(attribute, key) in attributes"
                      :key="key"
                      :show-attribute="showAttribute"
                      :sort="sort"
                      :attribute="attribute"
                      @change="onSort"/>
                  </slot>
                </tr>

                <tr
                  v-for="(resource, key) in data.resources"
                  :class="{ 'disable': loading }"
                  class="table-row"
                  @click="alert('a')">

                  <td >
                    <div class="pretty p-default">
                      <input
                        v-model="selected[key]"
                        type="checkbox">
                      <div class="state p-primary-o">
                        <label/>
                      </div>
                    </div>
                  </td>

                  <slot name="row">
                    <slot
                      :getAttribute="getAttribute"
                      :showAttribute="showAttribute"
                      :resource="resource"
                      name="row">
                      <td
                        v-for="attribute in attributes"
                        v-if="showAttribute(attribute)"
                        @click="goToShow(resource)"
                        v-html="attribute.extractReadableValue(resource)"/>
                    </slot>
                  </slot>
                </tr>
              </table>

              <resource-index-pagination
                v-if="data"
                :pagination="pagination"
                @change="onChangePagination"/>

            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal
      :id="'delete-'+config.route"
      :ref="'delete-'+config.route"
      :title="$t('removing')"
      hide-footer>
      <div class="d-block text-center">
        <p>{{ $t('irreversible_operation') }} <br><br>{{ $t('are_you_sure') }}</p>
      </div>
      <b-btn
        class="mt-3"
        variant="outline-danger"
        block
        @click="hideModal('delete-'+config.route); removeSelected();">{{ $t('yes') }}</b-btn>
      <b-btn
        class="mt-3"
        variant="outline-primary"
        block
        @click="hideModal('delete-'+config.route); ">{{ $t('no') }}</b-btn>
    </b-modal>
    <!--<div class="spinner" v-if='!data'></div>-->

  </div>
</template>

<script>

import { ResourceIndex } from '../mixins/ResourceIndex'
import NoResults from '../components/NoResults'
import ResourceIndexPagination from './ResourceIndexPagination'
import ResourceIndexQuery from './ResourceIndexQuery'
import ResourceIndexSort from './ResourceIndexSort'

require('pretty-checkbox/dist/pretty-checkbox.min.css');
export default {
  components: {
    NoResults,
    ResourceIndexPagination,
    ResourceIndexSort,
    ResourceIndexQuery
  },
  mixins: [ResourceIndex],
  props: ['config'],
  created () {
    this.initConfig();
    this.manager = this.config.manager;
    this.attributes = this.config.attributes;
    this.listable = this.config.list;

    for (var i in this.attributes) {
      var attribute = this.attributes[i];

      this.isAttributeListable(attribute) && this.cols.push({ value: attribute.name, label: attribute.label, enabled: true});
    }
  },
  methods: {

    alert (message) {
      console.log('a');
    }
  }
}
</script>
<style scoped>
.resource-index-head {
padding: 30px 30px 10px 30px;
}

.table-column-select {
width: 60px;
}

.table-row:nth-child(even) {
background: #f7f7ff;
}

.table-row:hover {
background: #eaeaff;
}

.pretty .state label:before {
background: white;
}

.pretty .state label:before, .pretty .state label:after{
top: -2px;
}

.pretty {
line-height: 1;
}
.table tr:first-child td {
vertical-align: middle;
}
</style>
