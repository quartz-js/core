<template>
  <div class="content fluid" >
    <div class="fluid-fill"/>
    <div class="pagination fluid fluid-vcenter">
      <div/>
      <select
        v-model="_pagination.show"
        class="form-control"
        @change="onChange()">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="100">100</option>
      </select>
      <span
        class="btn btn-primary icon-circle"
        @click="prev()"><i class="fa fa-angle-double-left"/></span>
      <input
        v-model="_pagination.page"
        class="form-control"
        @change="onChange()">
      <span
        class="btn btn-primary icon-circle"
        @click="next()"><i class="fa fa-angle-double-right"/></span>
    </div>
  </div>
</template>
<script>

export default {
  props: ['pagination'],
  created () {
    this._pagination = this.pagination;

    if (this._pagination.page > this._pagination.pages) {
      this._pagination.page = this._pagination.pages;
      this.onChange();
    }
  },
  methods: {
    onChange: function () {
      this.$emit('on-change-pagination', this._pagination);
    },
    prev: function () {
      this._pagination.page = this._pagination.page <= 1 ? 1 : this._pagination.page - 1;
      this.onChange();
    },

    next: function () {
      this._pagination.page = this._pagination.page >= this._pagination.pages ? this._pagination.page : this._pagination.page + 1;
      this.onChange();
    }

  }
}

</script>

<style scoped>
.pagination {
  max-width: 400px;
  white-space: nowrap;
}

.pagination .form-control{
  text-align: center;
  margin: 0 10px;
  width: 60px;
}
</style>
