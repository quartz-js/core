<template>
  <div>
    <div v-if="resource !== 0 && resource !== null">
      <div class="fluid">
        <slot
          :resource="resource"
          name="main">
          <div class="page-section paper">
            <div class="fluid-fill content relative">
              <div
                :class="{ 'container-fields-editing': editing}"
                class="content">

                <h3>{{ config.title }} #{{ resource.id }}</h3>

                <div>
                  <div v-if="errors.length > 0">
                    <br>
                    <ul class="alert alert-danger">
                      An error has occurred<br>
                      <span v-for="error in errors">
                        - <b>{{ error.label }}</b>: {{ error.message }}<br>
                      </span>
                    </ul>
                  </div>
                  <div v-if="!shouldEdit()">

                    <div class="button-edit">
                      <button
                        class="btn btn-sm btn-primary"
                        @click="$router.push({name: config.route + '.index'})"><i class="fa fa-list"/><span class='w5'></span>List</button>
                        
                      <slot
                        :resource="resource"
                        name="buttons"/>

                      <button
                        v-b-modal="'delete-'+config.route"
                        v-if="config.remove === true"
                        class="btn btn-sm btn-danger"><i class="fa fa-trash"/><span class='w5'></span>Remove</button>

                      <button
                        v-if="config.update === true"
                        class="btn btn-sm btn-primary"
                        @click="toEdit(true)"><i class="fa fa-pencil-alt"/><span class='w5'></span> Update</button>

                    </div>
                    <slot
                      :getAttribute="getAttribute"
                      :resource="resource"
                      :errors="errors"
                      name="show"/>
                  </div>
                  <div v-if="shouldEdit()">
                    <div class="fix-spacing"/>
                    <div class="button-edit" >
                      <button
                        class="btn btn-sm btn-primary"
                        @click="save()"><i class="fa fa-save"/><span class='w5'></span> Save</button>
                      <button
                        v-if="!alwaysEdit()"
                        class="btn btn-sm btn-primary"
                        @click="toEdit(false)"><i class="fa fa-times"/><span class='w5'></span> Cancel</button>

                    </div>

                    <slot
                      :getAttribute="getAttribute"
                      :resource="resource"
                      :errors="errors"
                      name="edit"/>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </slot>

        <slot
          :resource="resource"
          name="extra"/>
        <slot
          :resource="resource"
          name="sidebar-right"/>
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
