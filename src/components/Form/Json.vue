<template>

    <div id='json' ref='json'>

    </div>
</template>

<script>

import JSONFormatter from 'json-formatter-js'

export default {

    props: ["json"],
    data: function() {
        return {
        }
    },

    methods: {
    },
    mounted: function() {
        const formatter = new JSONFormatter(this.json);
        this.$refs.json.appendChild(formatter.render());
    }
}

</script>