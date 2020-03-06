<template>
  <div class="px-2">
    <slot :config="config" name="body"></slot>
  </div>
</template>

<script>
import { ResourceLocalization } from '../../mixins/ResourceLocalization'
export default {
  mixins: [
  	ResourceLocalization
  ],
  props: {
    config: {
      type: Object,
      required: true,
    }
  }
}
</script>