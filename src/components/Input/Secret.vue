<template>
  <div>
    <v-text-field v-model="rawValue" :label="attribute.label" @input="onChange()"></v-text-field>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import Text from './Text';

export default {
  extends: Text,
}

</script>
