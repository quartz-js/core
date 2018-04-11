

export var ResourceEdit = {
    props: ['value'],
    components: {

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
            form: {},
            old_form: {},
            errors: [],
            timeout: null,
            skip: false,
        }
    },
    methods: {

        getAttribute(name) {
            return this.attributes.find(function(attribute) {
                return attribute.name === name;
            });
        },

        /**
         * Load data
         *
         * @return void
         */
        show () {
            var self = this
                
            this.manager.show(this.id).then(response => {
                self.resource = response.body.resource;
                self.old_form = JSON.parse(JSON.stringify(this.resource));
                self.form = self.data;
                this.$emit("input", self.resource);
            }).catch(response => {
                if (response.code == 'NOT-FOUND') {
                    self.data = 0
                }
                // self.$notify(response.message, 'error');
            })
        },
        /**
         * Save data
         *
         * @return void
         */
        save () {
            var self = this

            this.manager.update(this.id, this.resource).then(response => {
                self.syncing = false
                self.resource = response.body.resource;
                self.errors = [];
                self.form = self.data;
                self.old_form = JSON.parse(JSON.stringify(this.resource));
                self.editing = false;
                this.$emit("input", self.resource);
            }).catch(response => {
                self.syncing = false
                self.errors = response.body.errors
            });
        },
        
        remove: function(id) {

            this.manager.remove(id).then(response => {

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
    created () {

    },
    mounted () {
        this.id = this.$route.params.id;
        this.manager && this.show();
    }
}
