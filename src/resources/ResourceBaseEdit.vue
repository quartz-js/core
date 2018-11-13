<template>
  <div>
    <div v-if="resource !== 0 && resource !== null">
      <div>
        <slot :resource="resource" name="main">
          <div class="md-layout md-alignment-top">
            <div class="md-layout-item md-size-75">
              <md-card :class="{ 'container-fields-editing': editing}" class="content">
                <div>
                  <h3>{{ config.title }} #{{ resource.id }}</h3>
                  <hr>
                  <div v-if="errors && errors.length > 0">
                    <ul class="alert alert-danger">
                      An error has occurred<br>
                      <span v-for="error in errors">
                        - <b>{{ error.label }}</b>: {{ error.message }}<br>
                      </span>
                    </ul>
                  </div>
                  <div v-if="!shouldEdit()"  style='margin-top: -25px'>
                    <slot :getAttribute="getAttribute":resource="resource" :errors="errors" name="show"></slot>
                  </div>
                  <div v-if="shouldEdit()">
                    <slot :getAttribute="getAttribute" :resource="resource" :errors="errors" name="edit"></slot>
                  </div>
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
                    <md-list-item v-if="!shouldEdit() && config.remove === true" v-b-modal="'delete-'+config.route">
                      <md-icon>delete</md-icon>
                      <span class="md-list-item-text md-accent">Delete</span>
                    </md-list-item>
                    <md-list-item v-if="!shouldEdit() && config.update === true" @click="toEdit(true)">
                      <md-icon>edit</md-icon>
                      <span class="md-list-item-text">Update</span>
                    </md-list-item>
                    <md-list-item v-if="shouldEdit()" @click="save()" >
                      <md-icon>save</md-icon>
                      <span class="md-list-item-text">Save</span>
                    </md-list-item>
                    <md-list-item v-if="shouldEdit() && !alwaysEdit()" @click="toEdit(false)">
                      <md-icon>clear</md-icon>
                      <span class="md-list-item-text">Cancel</span>
                    </md-list-item>
                  </md-list>

                  <slot :resource="resource" name="buttons"></slot>
                </div>
              </md-card>
            </div>
          </div>
        </slot>
        <slot :resource="resource" name="extra"/>
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
        variant="danger"
        block
        @click="hideRemoveModal('delete-'+config.route); remove();">{{ $t('yes') }}</b-btn>
      <b-btn
        class="mt-3"
        variant="primary"
        block
        @click="hideRemoveModal('delete-'+config.route); ">{{ $t('no') }}</b-btn>
    </b-modal>
    <div v-if="resource === 0">
      <div class="page-section paper">
        <div class="fluid-fill content relative">
          <no-results />
        </div>
      </div>
    </div>
    <!--<div class="spinner" v-if='resource === null'></div>-->
  </div>
</template>

<script>

import { ResourceEdit } from '@railken/vue-admin-core/src/mixins/ResourceEdit'
import NoResults from '../components/NoResults'

export default {
  components: {
    NoResults
  },
  mixins: [ ResourceEdit ],
  props: ['config'],
  created () {
    this.manager = this.config.manager;
    this.attributes = this.config.attributes;
  },
  methods: {
    alwaysEdit () {
      return !this.config.show && this.config.update;
    },
    shouldEdit () {
      if (this.alwaysEdit()) {
        return true;
      }

      return this.editing;
    },
    toEdit (flag) {
      this.editing = flag;

      if (this.editing) {
        this.config.onShowEdit(this.resource);
      }
    }
  }
}

</script>
