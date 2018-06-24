import { ResourceBase } from './ResourceBase'
var _ = require('lodash');

export var ResourceEdit = {
    props: ['config', 'value'],
    components: {

    },
    mixins: [
        ResourceBase
    ],
    computed: {
        render() {
            return [this.resource];
        }
    },
    data () {
        return {
            id: null,
            attributes: [],
            manager: null,
            editing: false,
            syncing: false,
            error: false,
            resource: null,
            errors: [],
        }
    },
    watch: {
        resource: {
            handler: function(val, oldVal) {
                this.$emit("update", val);
            },
            deep: true,
        }
    },
    methods: {
        
        /**
         * Load data
         *
         * @return void
         */
        show () {
            var self = this
                
            this.manager.show(this.id).then(response => {

                this.handleResponse(response);

            }).catch(response => {
                self.resource = 0;
                // self.$notify(response.message, 'error');
            })
        },

        /**
         * Handle response
         *
         * @param {object} response
         *
         * @return void
         */
        handleResponse(response) {

            var self = this;
            var resource = response.body.resource;
            var promises = this.attributes.map(attribute => {
                return attribute.load([resource]);
            });

            Promise.all(promises).then(function() {
                self.resource = response.body.resource;
            }).catch(response => {
                // ... Some sort of error
            });
        },

        /**
         * Save data
         *
         * @return void
         */
        save () {
            var self = this

            var params = {};

            self.attributes.map(attribute => {
                return params[attribute.name] = self.resource[attribute.name];
            });

            var params1 = {};
            
            _.forEach(params, function(value, key) {
              _.set(params1, key, value);
            });

            this.manager.update(this.id, params1).then(response => {
                this.syncing = false
                this.errors = [];
                this.editing = false;
                this.handleResponse(response);

            }).catch(response => {
                self.syncing = false;
                self.errors = response.body.errors
            });
        },
        
        /**
         * Remove resource
         *
         * @return void
         */
        remove: function() {

            this.manager.remove(this.id).then(response => {
                this.$router.push({name: this.config.route + ".index"});
            }).catch(response => {
                alert('uhm...');
            });
        },
        
        /**
         * Hide modals remove resource
         *
         * @return void
         */
        hideRemoveModal (ref) {
            this.$refs[ref].hide()
        },
    },
    mounted () {

        this.initConfig();

        this.id = this.config.getKeyByRoute(this.$route.params);
        this.manager && this.show();
    }
}
