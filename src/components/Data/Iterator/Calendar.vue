<template>
  <q-card v-if="config.readable">
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-layout class='pa-2'>
            <q-btn  class="mr-4" @click="setToday">
              Today
            </q-btn>
            <v-btn fab text small @click="prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small @click="next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <span class="title">{{ title }}</span>
            <div class='flex-grow-1'></div>
            <v-menu bottom right>
              <template v-slot:activator="{ on }">
                <v-btn
                  outlined
                  v-on="on"
                >
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <slot name="top" :config="config" :big="true"></slot>
          </v-layout>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            locale="it"
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :event-margin-bottom="3"
            :now="today"
            :interval-format="intervalFormat"
            :type="type"
            :disabled="!loading"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>

          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            full-width
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                <div class="flex-grow-1"></div>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>

                <div class='text-right'>
                  <q-btn
                    color="primary" 
                    @click="goToShow(selectedEvent.resource)"
                    content-icon='visibility'
                    :content-text="$t('$quartz.core.show')"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </q-card>
</template>
<script>
import Common from './Common'

export default {
  extends: Common,
  data: () => ({
    today: null,
    focus: null,
    type: 'week',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',
    },
    dayFormat: function(interval) {
      return interval.time
    },
    intervalFormat: function(interval) {
      return interval.time
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
  }),
  computed: {
    events: {
      get: function() {
        return this.data ? this.data.map(i => {
          return {
            name: this.$container.get('template').parse(this.config.readable.title, i),
            details: this.$container.get('template').parse(this.config.readable.description, i),
            start: i.started_at,
            end: i.ended_at,
            color: this.$container.get('template').parse(this.config.readable.color, i) || "primary",
            resource: i
          }
        }) : []
      }
    },
    title () {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }

      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth

      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear

      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter () {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      })
    },
  },
    /*
  }
  mounted() {
    // events
      {
        name: 'Another Meeting',
        details: 'Another important meeting about nothing',
        start: '2019-01-07 10:00',
        end: '2019-01-07 13:30',
        color: 'brown',
      },
  },
    */
  methods: {
    getQueryVars() {
      return {
        start: this.start ? this.start.date : this.today,
        end: this.end ? this.end.date : this.today
      }
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = this.today
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.selectedOpen = true, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start
      this.end = end

      this.load()
    },
    nth (d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
  },
}
</script>
<style scoped>
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: #1867c0;
  color: #ffffff;
  border: 1px solid #1867c0;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  margin-right: 8px;
  position: relative;
}

.my-event.with-time {
  position: absolute;
  right: 4px;
  margin-right: 0px;
}
</style>