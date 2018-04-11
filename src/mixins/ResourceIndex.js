import ResourceIndexPagination from '../components/Resources/ResourceIndexPagination.vue'
import ResourceIndexQuery from '../components/Resources/ResourceIndexQuery.vue'

export var ResourceIndex = {
    components: {
        ResourceIndexPagination,
        ResourceIndexQuery
    },
    data: function() {
        return {
            pagination: {
                show: null,
                page: 0,
                max_pages: null,
            },
            query: '',
            manager: null,
            cols: {},
            data: null,
            form: {},
            params: null,
            import: {},
            errors: {
                form: [],
                search: null
            },
            timeout: null,
            selected: []
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
                this.$localStorage.set(this.manager.getFullUrl()+'.cols', JSON.stringify(val))
            },
            deep: true
        }
    },
    methods: {
        onChangePagination: function(pagination){
            this.pagination = pagination;
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

            console.log(query);
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

        /**
         * Load data
         *
         * @return void
         */
        load: function(params) {
            
            var manager = this.manager;
            var self = this
            this.params = params
            this.$router.push({
                query: {
                    query: this.query,
                    page: this.pagination.page,
                    show: this.pagination.show,
                }
            })

            this.selected = [];

            manager.index({
                query: this.query,
                show: this.pagination.show,
                page: this.pagination.page
            }).then(response => {

                self.errors.search = null
                self.data = response.body;
                self.pagination.pages = response.body.pagination.pages;
                self.pagination.page = response.body.pagination.page;

            }).catch(response => {

                if (response.body.code === 'QUERY_SYNTAX_ERROR') {
                    self.errors.search = response.body.message;
                }

                self.$notify(response.body.message, 'error')
            });
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

        hideModal () {
            this.$refs.delete.hide()
        },
    },
    created: function(){
        var self = this;


        this.query = this.$route.query.query ? this.$route.query.query : "created_at > '2018-01-01'";
        this.pagination.show = this.$route.query.show ? parseInt(this.$route.query.show) : 10;
        this.pagination.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
    },
    mounted: function() {
    
        this.load(null);

        
        try {
            var cols = JSON.parse(this.$localStorage.get(this.manager.getFullUrl()+'.cols'));

            for (var x in cols) {
                this.cols[x].enabled = cols[x].enabled;

            }
        } catch (e) {

        }

    }
}
