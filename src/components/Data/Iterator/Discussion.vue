<template>
  <div class="discussion">
    <v-timeline dense align-top>
      <v-timeline-item  v-for="item in data" large>
        <v-avatar slot="icon">
          <img src="http://i.pravatar.cc/64">
        </v-avatar>
        <q-card class="elevation-1 card" tile>
          <v-card-title style='background: #efefef' class="pa-2 px-3">
            <v-layout>
              <b>admin</b>&nbsp;commented {{ moment (item.created_at).fromNow() }}</v-layout>
              <v-spacer></v-spacer>

              <q-resource-edit :resource="item" :config="config">
                <template slot='edit' slot-scope="scope">
                  <q-attr-textarea v-model="scope.resource" :attribute="scope.config.getAttribute('body')" :errors="scope.errors"/>
                  <q-attr-text v-model="scope.resource" :attribute="scope.config.getAttribute('postable_type')" :errors="scope.errors"/>
                  <q-attr-text v-model="scope.resource" :attribute="scope.config.getAttribute('postable_id')" :errors="scope.errors"/>
                </template>
              </q-resource-edit>
              <q-resource-remove :resource="item" :config="config"></q-resource-remove>
            </v-card-title>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>{{ item.body }}</v-card-text>
          <v-divider></v-divider>
          <v-card-text class="pa-1">
            <span class=" mx-2">
            <v-btn flat icon color="blue lighten-2" class="ma-0">
              <q-icon>thumb_up</q-icon>
            </v-btn>
            <span class="ml-1" color="blue lighten-2">1</span>
            </span>
          </v-card-text>
        </q-card>
      </v-timeline-item>
    </v-timeline>
    <q-card class="pa-3">
      <q-resource-create  :config="config" type="fly" label-create="Comment">
        <template slot='create' slot-scope="scope">
          <q-attr-textarea 
            v-model="scope.resource" 
            :attribute="scope.config.getAttribute('body')" 
            :errors="scope.errors"
            :label="null"
            :hint="null"
            placeholder="Leave a comment"
          />
          <q-attr-text v-model="scope.resource" :attribute="scope.config.getAttribute('postable_type')" :errors="scope.errors"/>
          <q-attr-text v-model="scope.resource" :attribute="scope.config.getAttribute('postable_id')" :errors="scope.errors"/>
        </template>
      </q-resource-create>
    </q-card>
  </div>
</template>

<script>
import Table from './Table';
import moment from 'moment'

export default {
  extends: Table,
  methods: {
    defineDefaultValue() {
      this.pagination =  {
        sortBy: "id",
        descending: false,
        rowsPerPage: 25,
        totalPages: 0,
        page: 1
      }
    },
    moment: function (date) {
      return moment(date);
    }
  }
}
 
</script>
<style>
  .card {
    border-color: #efefef !important;
  }

  .discussion {
    border-top: 2px solid #efefef;
    margin-top: 2px;
  }
</style>