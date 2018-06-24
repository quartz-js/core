import { ResourceBase } from './ResourceBase'

export var ResourceIndex = {
    components: {
    },
    mixins: [
        ResourceBase
    ],
    data: function() {
        return {
            pagination: {
                show: null,
                page: 0,
                max_pages: null,
            },
            query: '',
            manager: null,
            cols: [],
            data: null,
            form: {},
            params: null,
            import: {},
            errors: {
                form: [],
                search: null
            },
            timeout: null,
            sort: {},
            selected: [],
            loading: false,
        }
    },
    computed: {
        compoundProperty() {
            return [this.query].join()
        }
    },
    watch: {
        compoundProperty: function(val, oldVal) {
            if (val == oldVal) {
                return
            }

            var self = this
            clearTimeout(self.timeout)

            self.timeout = setTimeout(function() {
                self.load()
            }, 300)
        },
        cols: {
            handler: function(val, oldVal) {
                this.$localStorage.set(this.config.manager.getFullUrl()+'.cols', JSON.stringify(val))
            },
            deep: true
        }
    },
    methods: {

        /**
         * Get attribute by name
         *
         * @param {string} name
         *
         * @return {BaseAttribute}
         */
        getAttribute(name) {
            return this.attributes.find(function(attribute) {
                return attribute.name === name;
            });
        },
        getAttributes(names) {

            return this.attributes.filter(function(attribute) {
                return names.indexOf(attribute.name) !== -1;
            });
        },
        onChangePagination: function(pagination){
            this.pagination = pagination;
            this.load();
        },
        onSort: function(key, direction){
            this.sort.name = key;
            this.sort.value = direction;
            this.load();
        },
        updateAllSelected($event) {
            var self = this;
            this.selected = [];
            this.data.resources.map(function(value, key) {
                self.selected[key] = $event.target.checked;
            });
        },
        onChangeQuery: function(query){

            if (this.query == query) {
                return
            }

            this.query = query;

            var self = this
            clearTimeout(self.timeout)

            self.timeout = setTimeout(function() {
                self.load()
            }, 300)

        },
        showCol: function(name) {

        },

        onSearch: function() {

        },
        isAttributeListable: function(attribute) {
            return this.listable.indexOf(attribute.name) !== -1;
        },
        showAttribute: function(attribute) {
            return this.isAttributeListable(attribute) && this.cols.find(col => { return col.value === attribute.name}).enabled;
        },

        /**
         * Load data
         *
         * @return void
         */
        load: function(params) {
            
            var manager = this.config.manager;
            this.params = params;
            this.$router.push({
                query: {
                    query: this.query,
                    page: this.pagination.page,
                    show: this.pagination.show,
                }
            })


            this.loading = true;

            this.selected = [];

            manager.index({
                query: this.query,
                show: this.pagination.show,
                page: this.pagination.page,
                sort_field: this.sort.name,
                sort_direction: this.sort.value,
            }).then(response => {
                var self = this;
                this.errors.search = null
                this.pagination.pages = response.body.pagination.pages;
                this.pagination.page = response.body.pagination.page;
                this.sort = response.body.sort[0];
                this.loading = false;

                var promises = this.attributes.map(attribute => {
                    return attribute.load(response.body.resources);
                });

                Promise.all(promises).then(function() {
                    self.data = response.body;
                }).catch(response => {
                    this.$notify(response.message, 'error')
                });



            })/*.catch(response => {

                if (response.body && response.body.code === 'QUERY_SYNTAX_ERROR') {
                    this.errors.search = response.body.message;
                }

                this.data = null;
                this.loading = false;
            }).then(response => {
            });*/


        },

        removeSelected: function() {

            var self = this;
            
            var promises = this.selected.map(function(value, key) {
                return self.manager.remove(self.data.resources[key].id);
            });

            Promise.all(promises).then(response => {

                this.$notify(response.message, 'success')

            }).then(response => {
                this.load(null);
            }).catch(response => {
                this.$notify(response.message, 'error')
            });
        },

        hideModal (ref) {
            this.$refs[ref].hide()
        },
    },
    created: function(){
        var self = this;

        this.initConfig();

        this.query = this.$route.query.query ? this.$route.query.query : "";
        this.pagination.show = this.$route.query.show ? parseInt(this.$route.query.show) : 10;
        this.pagination.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
    },
    mounted: function() {
        

        if (!this.config.manager) {
            return null;
        }

        this.load(null);

        try {
            var cols = JSON.parse(this.$localStorage.get(this.config.manager.getFullUrl()+'.cols'));

            for (var x in cols) {
                this.cols.find(c => { return c.value === cols[x].value; }).enabled = cols[x].enabled;
            }

        } catch (e) {

        }

    }
}
