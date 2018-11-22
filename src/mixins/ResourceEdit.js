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
    render () {
      return [this.resource];
    }
  },
  data () {
    return {
      showRemoveDialog: false,
      id: null,
      attributes: [],
      manager: null,
      editing: false,
      syncing: false,
      error: false,
      resource: null,
      errors: []
    }
  },
  watch: {
    resource: {
      handler: function (val, oldVal) {
        this.$emit('update', val);
      },
      deep: true
    }
  },
  methods: {

    /**
   * Load data
   *
   * @return void
   */
    show () {
      this.manager.show(this.id).then(response => {
        this.handleResponse(response);
      }).catch(response => {
        this.resource = 0;
        // this.$notify(response.message, 'error');
      })
    },

    /**
     * Handle response
     *
     * @param {object} response
     *
     * @return void
     */
    handleResponse (response) {
      var resource = response.body;
      var promises = this.attributes.map(attribute => {
        return attribute.load([resource.data]);
      });
      Promise.all(promises).then(() =>  {
        this.resource = response.body.data;
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
      var params = {};

      this.manager.update(this.id, this.resource).then(response => {

        this.syncing = false
        this.errors = [];
        this.editing = false;
        this.handleResponse(response);

        this.config.onUpdateSuccess(this, response);
      }).catch(response => {
        this.syncing = false;
        this.errors = response.body.errors
      });
    },

    /**
     * Remove resource
     *
     * @return void
     */
    remove: function () {
      this.manager.remove(this.id).then(response => {
        this.config.onRemoveSuccess(this, response);
      }).catch(response => {
        console.log(response);
      });
    },
  },
  mounted () {
    this.initConfig();

    this.id = this.config.getId(this);
    this.show();
  }
}
