<template>
  <div>
    <slot :config="config" name="body"></slot>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true,
    }
  }
}
</script>