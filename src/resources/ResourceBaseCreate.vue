<template>

  <div class="fluid">
    <div class="page-section paper">
      <div class="fluid-fill content relative">
        <div class="content">

          <h3>{{ config.title }} </h3>

          <div v-if="errors.length > 0">
            <br>
            <ul class="alert alert-danger">
              An error has occurred<br>
              <span v-for="error in errors">
                - <b>{{ error.label }}</b>: {{ error.message }}<br>
              </span>
            </ul>
          </div>
          <div>
            <div class="fix-spacing"/>
            <div class="button-edit" >
              <button
                class="btn btn-sm btn-primary"
                @click="$router.push({name: config.route + '.index'})"><i class="fa fa-list"/></button>
              <button
                class="btn btn-sm btn-primary"
                @click="create()"><i class="fa fa-save"/></button>

            </div>

            <slot
              :getAttribute="getAttribute"
              :resource="resource"
              :errors="errors"
              name="create"/>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { ResourceCreate } from 'railken-vue-admin-core/src/mixins/ResourceCreate'

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
