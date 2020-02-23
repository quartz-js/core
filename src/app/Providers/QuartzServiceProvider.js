import { ServiceProvider } from './ServiceProvider'
import { container } from '../../app/Container'
import { Template } from '../../app/Template'
import { Parser } from '../../app/Api/Parser'
const axios = require('axios');
import { Datetime } from 'vue-datetime';
import Twig from 'twig';
import _ from 'lodash'

require('vue-datetime/dist/vue-datetime.css')

export class QuartzServiceProvider extends ServiceProvider {

  register() {

  	container.set('$quartz.tags', ['data', 'system'])
    container.set('$quartz.data', [])
    container.set('axios', axios.create({}))
    container.set('template', new Template)

    this.registerComponent('datetime', Datetime)

    Parser.interceptors();

    this.addLang({
      'en': require('../../lang/en.json'),
      'it': require('../../lang/it.json')
    })

  }
}