export var ResourceShow = {
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
    mounted() {
        var self = this;
        self.load();
    }
}
