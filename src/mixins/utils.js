import moment from 'moment'
import S from 'string';

export var utils = {
  methods: {
    moment: function (value) {
      return moment(value);
    },
    string: function (string) {
   		return S(string);
    }
  }
}
