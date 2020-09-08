<template>
  <div>
    <q-card>
      <v-layout align-center class="pa-3"  v-if="showTable">
        <div><q-view-icon :src="config.icon" width='50' /></div>
        <div class='mx-5'>
          <h2 class='headline font-weight-thin'>
            {{ config.name }}
            <v-chip color="pink" label small text-color="white" class='mx-2'>System</v-chip>
            <v-chip color="purple" label small text-color="white" class='mx-2'>Schema</v-chip>
            <v-chip color="blue" label small text-color="white" class='mx-2'>Data</v-chip>
          </h2>
        </div>
        <v-spacer />
        <slot name="top" :config="config"></slot>
      </v-layout>
      <v-divider></v-divider>
      <v-layout align-start class="pl-5 pt-5 pr-5" :class="{'noBottomMargin': !errors.search}" v-if="showTable">
        <v-text-field
          id="search"
          type="search"
          v-model="queryParams.query" 
          class="search py-0" 
          :placeholder="$t('$quartz.core.search-placeholder')" 
          :error-messages="errors.search"  
          single-line 
          name='search'
          outlined
          @keydown.enter="load()"
        ></v-text-field>

        <!--<div class="text-right"><slot name="top" :config="config"></slot></div>-->
      </v-layout>
      <v-divider></v-divider>
      <div v-if="showContent">
        <div v-if="showTable">
        
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="response.body.data || []"
          :search="null"
          :show-select="true"
          item-key="id"
          v-if="response && response.body"
          :items-per-page="queryParams.rowsPerPage"
          :page.sync="queryParams.page"
          :server-items-length="queryParams.totalItems"
          :loading="loading"
          :headers-length="countColumns()"
          multi-sort
          calculate-widths
          hide-default-header
          :options.sync="options"
          :footer-props="{
            'items-per-page-options': rowsPerPageItems
          }"
          flat
          class="data-table"
        >
          <v-progress-linear slot="progress" color="blue" indeterminate style='margin-top: -1px; height: 3px'></v-progress-linear>

          <template v-slot:header="{ props: { headers } }">
            <slot name="header" :headers="headers">
              <thead>
                <tr>
                  <th></th>
                  <th
                    v-for="header in headers"
                    :key="header.text"
                    v-if="header.attribute"
                  >
                    {{ header.attribute.label }}
                  </th>
                </tr>
              </thead>
            </slot>
          </template>
          <template v-slot:body="{ items,select }" >
            <tbody>
              <tr v-for="item in items" :key="item.id" :class="{'disable': !config.showRow(item)}">
                <td style='max-width: 40px;'><v-checkbox color="primary" class="mt-2"></v-checkbox></td>
                <td 
                  v-for="(attribute, index) in attributesShowable()" 
                  :key="index" 
                  :width="getAttributeWidth(attribute)" 
                  @click="switchRow(item);"
                  :data-attribute-name="attribute.name"
                >
                  <component :is="attribute.showComponent" :resource="item" :attribute="attribute" :showLabel="false" class="cell ma-0"/>
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
            <q-view-icon :src='config.icon' width='218' class='my-3 mx-auto' />
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
        this.queryParams.rowsPerPage = this.options.itemsPerPage;
        this.queryParams.page = this.options.page

        this.queryParams.sort = this.options.sortDesc.map((i, key) => {
          return {
            descending: i,
            attribute: this.options.sortBy[key]
          }
        })

        this.load();
      },
      deep: true
    },
    "queryParams.query": {
      handler () {
        clearTimeout(this.queryTimeout)

        this.queryTimeout = setTimeout(i => {
          this.load()
        }, 300)
      }
    }
  },
  methods: {
    retrieved () {
      this.showTable = this.loading || (this.queryParams && this.queryParams.totalItems !== 0) || this.queryParams.query
    }
  },
  mounted() {
    this.options = {
      multiSort: true,
      sortBy: this.queryParams.sort.map(i => i.attribute),
      sortDesc: this.queryParams.sort.map(i => i.descending)
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
  }

  .noBottomMargin {
    margin-bottom: -10px;
  }
</style>