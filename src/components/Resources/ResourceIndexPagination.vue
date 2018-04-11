<template>
    <div class='content fluid' >
        <div class='fluid-fill'></div>
        <div class='pagination fluid fluid-vcenter'>
            <div></div>
            <select v-model='_pagination.show' class='form-control' v-on:change='onChange()'>
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='100'>100</option>
            </select>
            <span class='btn btn-primary icon-circle' v-on:click='prev()'><i class='fa fa-angle-double-left'></i></span>
            <input class='form-control' v-model='_pagination.page' v-on:change='onChange()'>
            <span class='btn btn-primary icon-circle' v-on:click='next()'><i class='fa fa-angle-double-right'></i></span>
        </div>
    </div>
</template>
<script>

export default {
    props: ['pagination'],
    methods: {
        onChange: function() {
            this.$emit("on-change-pagination", this._pagination);
        },
        prev: function() {
            this._pagination.page = this._pagination.page <= 1 ? 1 : this._pagination.page - 1;
            this.onChange();
        },

        next: function() {
            this._pagination.page = this._pagination.page >= this._pagination.pages ? this._pagination.page : this._pagination.page + 1;
            this.onChange();
        },
       
    },
    created () {
        this._pagination =  this.pagination;

        console.log(this._pagination.pages);
        if (this._pagination.page > this._pagination.pages) {
            this._pagination.page = this._pagination.pages;
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