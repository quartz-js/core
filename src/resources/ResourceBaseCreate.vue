<template>

  <div class="md-layout md-alignment-top">
    <div class="md-layout-item md-size-75">
      <md-card :class="{ 'container-fields-editing': editing}" class="content">

        <h3>{{ config.title }} </h3>

        <div v-if="errors && errors.length > 0">
          <br>
          <ul class="alert alert-danger">
            An error has occurred<br>
            <span v-for="error in errors">
              - <b>{{ error.label }}</b>: {{ error.message }}<br>
            </span>
          </ul>
        </div>
        <div>
          <slot :getAttribute="getAttribute"  :resource="resource" :errors="errors" name="create"/>
        </div>
      </md-card>

    </div>
    <div class="md-layout-item md-size-25">
      <md-card >
        <div>
          <md-list>
            <md-list-item @click="$router.push({name: config.route + '.index'})">
              <md-icon>list</md-icon>
              <span class="md-list-item-text">List</span>
            </md-list-item>

            <md-list-item @click="create()" >
              <md-icon>save</md-icon>
              <span class="md-list-item-text">Create</span>
            </md-list-item>
          </md-list>

          <slot :resource="resource" name="buttons"></slot>
        </div>
      </md-card>
    </div>
  </div>
</template>

<script>

import { ResourceCreate } from '@railken/vue-admin-core/src/mixins/ResourceCreate'

export default {
  mixins: [ ResourceCreate ],
  props: ['config'],
  created () {
    this.manager = this.config.manager;
    this.attributes = this.config.attributes;
    this.route = this.config.route;
  }
}

</script>
