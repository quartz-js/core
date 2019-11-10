<template>
  <div>
    <q-card class="pa-3 mb-4" v-if="showTable">
      <v-layout align-start>
        <v-text-field
          id="search"
          v-model="query" 
          class="search" 
          :placeholder="$t('$quartz.core.search-placeholder')" 
          :error="!!errors.search" 
          single-line 
          hide-details 
          name='search'
          @keydown.enter="load()"
        ></v-text-field>
        <q-btn
          color="primary" 
          @click="load()"
          content-icon='search'
          :content-text="$t('$quartz.core.search')"
        />

        <div class="text-right"><slot name="top" :config="config"></slot></div>
      </v-layout>
    </q-card>
    <q-card>
      <div v-if="showContent">
        <div v-if="showTable">
        
        <v-data-table
          v-model="selected"
          :headers="getHeaders()"
          :items="data"
          :search="null"
          :show-select="true"
          item-key="id"
          v-if="response"
          :items-per-page="pagination.rowsPerPage"
          :page.sync="pagination.page"
          :server-items-length="pagination.totalItems"
          :loading="loading"
          :headers-length="countColumns()"
          multi-sort
          :options.sync="options"
          :footer-props="{
            'items-per-page-options': rowsPerPageItems
          }"
          flat
        >
          <v-progress-linear slot="progress" color="blue" indeterminate style='margin-top: -1px; height: 3px'></v-progress-linear>

          <template v-slot:header="{ headers }">
            <thead>
              <tr>
                <th
                  v-for="header in headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)"
                >
                  {{ header.attribute.label }}
                  <q-icon small>arrow_upward</q-icon>
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot:body="{ items,select }" >
            <tbody>
              <tr v-for="item in items" :key="item.id" :class="{'disable': !config.showRow(item)}">
                <td><v-checkbox color="primary" class="mt-2"></v-checkbox></td>
                <td 
                  v-for="(attribute, index) in attributesShowable()" 
                  v-if="showAttribute(attribute)" 
                  :key="index" 
                  class="cell" 
                  :width="getAttributeWidth(attribute)" 
                  style='cursor: pointer' 
                  @click="switchRow(item);"
                >
                  <q-show-text :resource="item" :attribute="attribute" :showLabel="false" class="ma-0"/>
                </td>
                <td>
                  <div class="justify-end align-center layout px-2 text-right" :class="{'hide': !config.showRow(item)}">
                    <slot name="actions" :resource="item" :config="config"></slot>
                    <q-btn-table
                      color="primary" 
                      @click="goToShow(item)"
                      content-icon='visibility'
                      :content-text="$t('$quartz.core.show')"
                    />
                  </div>
                </td>
              </tr>
              <tr v-if="items.length === 0">
                <td :colspan='attributesShowable().length + 2' class='text-center'>
                  {{ $t('$quartz.core.no-results.message') }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </div>
      <div v-else>
         <div class='content text-md-center'>
            <img :src='config.icon' width='218' class='my-3'>
            <h3 class='title my-3'>{{ $t('$quartz.core.no-results.message') }}</h3>
            <p class='my-4' style='max-width: 800px; margin: 0 auto'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer lobortis in arcu at pellentesque. Sed at porta odio. Vivamus sollicitudin euismod justo id ornare. Suspendisse a metus orci. Cras tempor finibus metus, nec dictum enim sollicitudin sit amet. Vestibulum et suscipit lacus. Nam vestibulum tempus dolor.
              <!--{{ getResourceDescription(config) }}-->
            </p>
            <slot name="top" :config="config" :big="true"></slot>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>

import Common from './Common'

export default {
  extends: Common,
  data() {
    return {
      showTable: true,
      options: {}
    }
  },
  watch: {
    options: {
      handler () {
        this.pagination.rowsPerPage = this.options.itemsPerPage;
        this.pagination.page = this.options.page

        this.pagination.sort = this.options.sortDesc.map((i, key) => {
          return {
            descending: i,
            attribute: this.options.sortBy[key]
          }
        })

        this.load();
      },
      deep: true
    }
  },
  methods: {
    retrieved () {
      this.showTable = this.loading || (this.pagination && this.pagination.totalItems !== 0) || this.query
    }
  },
  mounted() {
    this.query = this.$route.query.query;

    this.options = {
      multiSort: true,
      sortBy: this.pagination.sort.map(i => i.attribute),
      sortDesc: this.pagination.sort.map(i => i.descending)
    }
    this.load();
  }
}
</script>
<style scoped>
  .search {
    padding-top:0;
  }

  .cell {
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
    padding: 0 12px !important;
  }
</style>