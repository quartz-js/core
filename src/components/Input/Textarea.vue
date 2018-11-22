<template>
  <div>
    <v-textarea v-model="rawValue" :label="attribute.label" @input="onChange()"></v-textarea>
    <div v-if="error" class="error">{{ $t("API_" + error.code) }}&nbsp;</div>
  </div>
</template>
<script>

import Text from './Text';

export default {
  extends: Text,
}

</script>
