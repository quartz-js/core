<template>
  <div>
    <v-card class="pa-2">
      <q-select 
        :items="types"
        v-model="type"
      />
      <q-date 
        v-model="start"
      />
      <q-date 
        v-model="end"
      />
    </v-card>
    <v-card class="mt-5">
      <v-calendar
        :type="type"
        now="2019-01-08"
        :weekdays="weekdays"
        v-model="value"
        :events="events"
      ></v-calendar>
    </v-card>
  </div>
</template>
<script>
export default {
  data: () => ({
    value: null,
    start: '2019-01-12',
    end: '2019-01-12',
    types: [
      { text: 'Day', value: 'day' },
      { text: '4 Day', value: '4day' },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' },
      { text: 'Custom Daily', value: 'custom-daily' },
      { text: 'Custom Weekly', value: 'custom-weekly' },
    ],
    type: 'week',
    weekdays: weekdaysDefault,
    weekdaysOptions: [
      { text: 'Sunday - Saturday', value: weekdaysDefault },
      { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
      { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
    ],
    events: [
      {
        name: 'Vacation',
        start: '2018-12-30',
        end: '2019-01-02',
      },
      {
        name: 'Meeting',
        start: '2019-01-07',
      },
      {
        name: '30th Birthday',
        start: '2019-01-03',
      },
      {
        name: 'New Year',
        start: '2019-01-01',
      },
      {
        name: 'Conference',
        start: '2019-01-21',
      },
      {
        name: 'Hackathon',
        start: '2019-01-30',
        end: '2019-02-01',
      },
    ],
  }),
}
</script>