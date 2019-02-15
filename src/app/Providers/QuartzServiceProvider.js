import { ServiceProvider } from './ServiceProvider'
import { container } from '../../services/container'
export class QuartzServiceProvider extends ServiceProvider {

  register() {

  	container.set('$quartz.tags', ['app', 'data', 'system', 'log'])
    container.set('$quartz.data', [])

    this.addLang({
      'en': require('../../lang/en.json'),
      'it': require('../../lang/it.json')
    })
  }
}