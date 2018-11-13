<template>
  <div class="content fluid" >
    <div class="fluid-fill"/>
    <div class="pagination fluid fluid-vcenter">
      <div/>
      <md-field>
        <md-select v-model="_pagination.show" @change="onChange()" style='width: 60px'>
          <md-option value="10">10</md-option>
          <md-option value="25">25</md-option>
          <md-option value="100">100</md-option>
        </md-select>
      </md-field>

      <md-button class="md-raised md-primary avatar" @click="prev()"><i class="fa fa-angle-double-left"/></md-button>
      <input v-model="_pagination.page" class="form-control" @change="onChange()">
      <md-button class="md-raised md-primary avatar" @click="next()"><i class="fa fa-angle-double-right"/></md-button>
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
      this.$emit('change', this._pagination);
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
