<template>
  <div v-if="errors">
    <v-alert :value="true" type="error" v-if="errors instanceof Array && errors.length > 0">
      An error has occurred<br>
      <span v-for="error in errors">
        - <b>{{ error.label }}</b>: {{ error.message }}<br>
      </span>
    </v-alert>
    <v-alert :value="true" type="error" v-if="typeof errors === 'string'">
      An error has occurred<br>
      {{ errors }}
    </v-alert>
  </div>
</template>
<script>

export default {
	props: ['errors'],
}
</script>
<style scoped>
  .v-alert {
    text-align: left;
  }
</style>