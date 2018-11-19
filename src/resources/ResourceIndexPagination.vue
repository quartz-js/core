<template>
  <div class="content fluid">
    <div class="fluid-fill"></div>
    <div class="fluid fluid-vcenter">
      <md-field>
        <md-select v-model="raw.show" style='width: 60px'>
          <md-option value="10">10</md-option>
          <md-option value="25">25</md-option>
          <md-option value="100">100</md-option>
        </md-select>
      </md-field>
      <md-button class="md-primary md-icon-button" @click="prev()"><i class="fa fa-angle-double-left"/></md-button>
      <md-field class="page">
        <md-input v-model="raw.page" style='width: 40px'></md-input>
      </md-field>
      <md-button class="md-primary md-icon-button" @click="next()"><i class="fa fa-angle-double-right"/></md-button>
    </div>
  </div>
</template>
<script>

export default {
  props: ['pagination'],
  data: function () {
    return {
      raw: {
        show: 10,
        page: 1
      }
    }
  },
  watch: {
    "raw.show": function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.onChange();
      }
    },
    "raw.page": function(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.onChange();
      }
    }
  },
  created () {
    this.raw.show = this.pagination.show;
    this.raw.page = this.pagination.page;
    this.raw.pages = this.pagination.pages;
  
    if (this.raw.page > this.raw.pages) {
      this.raw.page = this.raw.pages;
    }
  },
  methods: {
    onChange: function () {
      this.$emit('change', this.raw);
    },
    prev: function () {
      this.raw.page = this.raw.page <= 1 ? 1 : this.raw.page - 1;
    },

    next: function () {
      this.raw.page = this.raw.page >= this.raw.pages ? this.raw.page : this.raw.page + 1;
    }

  }
}

</script>

<style scoped>
.page > * {
  text-align: center;
}
</style>
