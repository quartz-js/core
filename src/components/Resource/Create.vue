<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap v-if="!type || type === 'page'">
      <v-flex xs9>
        <v-card class="content" :flat="flat">
          <v-card-title><h3 class='title'>{{ config.title }}</h3></v-card-title>
          <v-divider class='mb-45'></v-divider>
          <errors :errors='errors' />
          <div>
            <slot :getAttribute="getAttribute" :resource="resource" :errors="errors" name="create"/>
          </div>
        </v-card>
      </v-flex>
      <v-flex xs3>
        <v-card :flat="flat">
          <div>
            <v-list>
              <v-list-tile @click="$router.push({name: config.route + '.index'})">
                <v-list-tile-action><v-icon>list</v-icon></v-list-tile-action>
                <v-list-tile-content>List</v-list-tile-content>
              </v-list-tile>

              <v-list-tile @click="create()">
                <v-list-tile-action><v-icon color="primary">save</v-icon></v-list-tile-action>
                <v-list-tile-content color="primary">Create</v-list-tile-content>
              </v-list-tile>
            </v-list>

            <slot :resource="resource" name="buttons"></slot>
          </div>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap v-if="type === 'wrap'">
      <v-flex xs12>
        <v-card class="content" :flat="flat">
          <v-card-title><h3 class='title'>{{ config.title }}</h3></v-card-title>
          <v-divider class='mb-5'></v-divider>
          <errors :errors='errors' />
          <div>
            <slot :getAttribute="getAttribute" :resource="resource" :errors="errors" name="create"/>
          </div>

          <div class='text-xs-right mt-5'>
            <v-btn color="primary"  @click="create()">Create</v-btn>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { ResourceCreate } from '@railken/vue-admin-core/src/mixins/ResourceCreate'
import Errors from '@railken/vue-admin-core/src/components/Errors'

export default {
  mixins: [ ResourceCreate ],
  components: { 'errors': Errors },
  props: ['config', 'flat', 'type'],
  created () {
    this.manager = this.config.manager;
    this.attributes = this.config.attributes;
    this.route = this.config.route;
  }
}

</script>
