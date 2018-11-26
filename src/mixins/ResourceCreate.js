

export var ResourceCreate = {
  props: ['value'],
  data () {
    return {
      attributes: [],
      manager: null,
      error: false,
      resource: {},
      route: null,
      errors: []
    }
  },
  methods: {

    /**
    * Save data
    *
    * @return void
    */
    create () {
      this.manager.create(this.resource).then(response => {
        this.config.onCreateSuccess(this, response);
      }).catch(response => {
        this.errors = response.body.errors
      });
    }

  }
}
