import { ResourceBase } from './ResourceBase'

export var ResourceCreate = {
    props: ['value'],
    mixins: [
        ResourceBase
    ],
    data () {
        return {
            attributes: [],
            manager: null,
            error: false,
            resource: {},
            route: null,
            errors: [],
        }
    },
    methods: {

        getAttribute(name) {
            return this.attributes.find(function(attribute) {
                return attribute.name === name;
            });
        },

        /**
         * Save data
         *
         * @return void
         */
        create () {
            var self = this

            this.manager.create(this.resource).then(response => {
                
                this.$router.push({name : this.route + '.show', params: this.config.getParamsShow(response.body.resource)})

            }).catch(response => {
                self.errors = response.body.errors
            });
        },
        

    },

    created() {
        this.initConfig();
    }
}
