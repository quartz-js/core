<template>
    <div class='content'>
          <div>
            <div class='form-group' v-bind:class="{error: error}">
                <input type='text' class='form-control' placeholder=' ' v-model='_query' v-on:input="onChange()">
                <span class="form-highlight"></span>
                <label>{{ $t('query_label') }}</label>
            </div>

            <div class="error">{{ error }}&nbsp;</div>

        </div>
    </div>
</template>
<script>

export default {
    props: ['query', 'error'],
    methods: {
        onChange: function() {
            this.$emit("on-change-query", this._query);
        },
       
    },
    created () {
        this._query =  this.query;
    }
}

</script>