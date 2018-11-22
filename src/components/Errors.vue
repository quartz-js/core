<template>
  <div v-if="errors && errors.length > 0">
    <v-alert :value="true" type="error">
      An error has occurred<br>
      <span v-for="error in errors">
        - <b>{{ error.label }}</b>: {{ error.message }}<br>
      </span>
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