<template>
  <td
    v-if="showAttribute(attribute)"
    class="table-column-head selector">
    <div
      :class="{ 'hide': ! (sort.name == attribute.name && sort.value == 'asc')}"
      @click="onChange(attribute.name, 'desc')">
      <div class="nav-link table-column-head-content"><span>{{ attribute.label }}</span><span class="fill"/> <i class="fas fa-sort-up"/></div>
    </div>
    <div
      :class="{ 'hide': ! (sort.name == attribute.name && sort.value == 'desc')}"
      @click="onChange(attribute.name, 'asc')">
      <div class="nav-link table-column-head-content"><span>{{ attribute.label }}</span><span class="fill"/> <i class="fas fa-sort-down"/></div>
    </div>
    <div
      :class="{ 'hide': ! (sort.name != attribute.name)}"
      @click="onChange(attribute.name, 'asc')">
      <div class="nav-link table-column-head-content"><span>{{ attribute.label }}</span><span class="fill"/></div>
    </div>
  </td>
</template>
<script>

export default {
  props: ['sort', 'attribute', 'showAttribute'],
  methods: {
    onChange: function (name, direction) {
      this.$emit('change', name, direction);
    }
  }
}

</script>

<style scoped>

</style>
