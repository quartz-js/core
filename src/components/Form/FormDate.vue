<template>

  <div>
    <date-picker :value="value" :lang="lang" class='form-control date-picker' v-on:change="onInput($event)"></date-picker>
    <span class="form-highlight"/>
  </div>
  </div>
</template>

<script>

import DatePicker from 'vue2-datepicker'

export default {

  props: ['value', 'placeholder'],
  components: {
    DatePicker
  },

  data() {
    return {
      lang: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
        placeholder: {
          date: this.placeholder,
          dateRange: 'Select Date Range'
        }
      }
    }
  },

  methods: {
    onInput ($event) {
      this.$emit('input', $event);
    }
  },

  created() {
    if (!this.placeholder) {
      this.placeholder = "Select Date"
    }
  }
}

</script>

<style>
  .mx-input{
    border: none !important;
    box-shadow: none !important;
    opacity: 0.6 !important;
    font-size: 15px !important;
    padding: 0 1px !important;
    color: inherit !important;
  }

  .mx-datepicker {
    width: 100% !important;
    font-family: inherit !important;
    color: inherit !important;
  }

  .mx-calendar {
    font-family: inherit !important;
  }

  .date-picker {
    z-index: initial;
  }
</style>
