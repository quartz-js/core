<template>
    <td v-if="showAttribute(attribute)" class='table-column-head'> 
        <div v-bind:class="{ 'hide': ! (sort.name == attribute.name && sort.value == 'asc')}" v-on:click="onChange(attribute.name, 'desc')">
            <div class='nav-link table-column-head-content'><span>{{ attribute.label }}</span><span class='fill'></span> <i class='fas fa-sort-up'></i></div>
        </div>
        <div v-bind:class="{ 'hide': ! (sort.name == attribute.name && sort.value == 'desc')}" v-on:click="onChange(attribute.name, 'asc')">
            <div class='nav-link table-column-head-content'><span>{{ attribute.label }}</span><span class='fill'></span> <i class='fas fa-sort-down'></i></div>
        </div>
        <div v-bind:class="{ 'hide': ! (sort.name != attribute.name)}" v-on:click="onChange(attribute.name, 'asc')">
            <div class='nav-link table-column-head-content'><span>{{ attribute.label }}</span><span class='fill'></span></div>
        </div>
    </td>
</template>
<script>

export default {
    props: ['sort', 'attribute', 'showAttribute'],
    methods: {
        onChange: function(name, direction) {
            this.$emit("change", name, direction);
        },
    }
}

</script>

<style scoped>

</style>