<template>
  <div class="my-5">
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