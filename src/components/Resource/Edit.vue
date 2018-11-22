<template>

  <div>
    <div v-if="resource !== 0 && resource !== null">
      <div>
        <slot :resource="resource" name="main">
          <v-container grid-list-md text-xs-center v-if="!type || type === 'page'">
            <v-layout row wrap>
              <v-flex xs9>
                <v-card :class="{ 'container-fields-editing': editing}" class="content" :flat="flat">
                  <div>
                    <v-card-title><h3 class='title'>{{ config.title }} #{{ resource.id }}</h3></v-card-title>
                    <v-divider class='mb-5'></v-divider>
                    <errors :errors='errors' />
                    <div v-if="!shouldEdit()" >
                      <slot :getAttribute="getAttribute":resource="resource" :errors="errors" name="show"></slot>
                    </div>
                    <div v-if="shouldEdit()">
                      <slot :getAttribute="getAttribute" :resource="resource" :errors="errors" name="edit"></slot>
                    </div>
                  </div>
                </v-card>
              </v-flex>
              <v-flex xs3>
                <v-card class="content" :flat="flat">
                  <div>
                    <v-list>
                      <v-list-tile @click="$router.push({name: config.route + '.index'})">
                        <v-list-tile-action><v-icon>list</v-icon></v-list-tile-action>
                        <v-list-tile-content>List</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="!shouldEdit() && config.remove === true" @click="showRemoveDialog = true" color="error">
                        <v-list-tile-action><v-icon color="error">delete</v-icon></v-list-tile-action>
                        <v-list-tile-content>Delete</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="!shouldEdit() && config.update === true" @click="toEdit(true)" color="primary">
                        <v-list-tile-action ><v-icon color="primary">update</v-icon></v-list-tile-action>
                        <v-list-tile-content>Update</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="shouldEdit()" @click="save()" color="primary">
                        <v-list-tile-action><v-icon color="primary">save</v-icon></v-list-tile-action>
                        <v-list-tile-content>Save</v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile v-if="shouldEdit() && !alwaysEdit()" @click="toEdit(false)">
                        <v-list-tile-action><v-icon>clear</v-icon></v-list-tile-action>
                        <v-list-tile-content>Cancel</v-list-tile-content>
                      </v-list-tile>
                    </v-list>

                    <slot :resource="resource" name="buttons"></slot>
                  </div>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
          <v-container v-if="type === 'wrap'">
            <v-card class="content" :flat="flat">
              <div>
                <v-card-title><h3 class='title'>{{ config.title }} #{{ resource.id }}</h3></v-card-title>
                <v-divider class='mb-5'></v-divider>
                <errors :errors='errors' />

                <slot :getAttribute="getAttribute" :resource="resource" :errors="errors" name="edit"></slot>
              </div>
              <div class='text-xs-right mt-5'>
                <v-btn color="primary"  @click="save()">Save</v-btn>
              </div>
            </v-card>
          </v-container>
        </slot>
        <slot :resource="resource" name="extra"/>
      </div>

    </div>
    <v-dialog v-model="showRemoveDialog" width='400'>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          {{ $t('irreversible_operation.title') }}
        </v-card-title>

        <v-card-text>
          {{ $t('irreversible_operation.message') }}<br><br>{{ $t('irreversible_operation.question') }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showRemoveDialog = false">No</v-btn>
          <v-btn color="error" @click="showRemoveDialog = false; remove();">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import { ResourceEdit } from '@railken/vue-admin-core/src/mixins/ResourceEdit'
import Errors from '@railken/vue-admin-core/src/components/Errors'


export default {
  components: {
    Errors
  },
  mixins: [ ResourceEdit ],
  props: ['config', 'flat', 'type'],
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