import { ResourceBase } from './ResourceBase'

export var ResourceShow = {
    mixins: [
        ResourceBase
    ],
    data: function() {
        return {
            resource: null,
            timeout: null
        }
    },
    methods: {
        
        date: function(value) {
            return moment(value);
        },

        /**
         * Load data
         *
         * @return void
         */
        load: function(params) {
            
            var self = this;
            var id = this.$route.params.id;


            this.manager.show(id).then(response => {

                self.resource = response.body.resource;

            }).catch(response => {

                // handle 404
            });
        }
    },
    created() {

        this.initConfig();
    },
    mounted() {
        var self = this;
        self.load();
    }
}
