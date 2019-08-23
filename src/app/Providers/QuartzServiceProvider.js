import { ServiceProvider } from './ServiceProvider'
import { container } from '../../app/Container'
import { Parser } from '../../app/Api/Parser'
const axios = require('axios');
import { Datetime } from 'vue-datetime';

require('vue-datetime/dist/vue-datetime.css')

export class QuartzServiceProvider extends ServiceProvider {

  register() {

  	container.set('$quartz.tags', ['data', 'system'])
    container.set('$quartz.data', [])
    container.set('axios', axios.create({}))

    this.registerComponent('datetime', Datetime)

    Parser.interceptors();

    this.addLang({
      'en': require('../../lang/en.json'),
      'it': require('../../lang/it.json')
    })

  }
}