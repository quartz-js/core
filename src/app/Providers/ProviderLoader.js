import { ServiceProvider } from '@railken/quartz-core'

export class ProviderLoader {

  constructor() {
    this.providers = [];
  }

  addProviders (providers) {
    providers.map(provider => {
      this.addProvider(provider)
    })
  }

  addProvider (provider) {
    if (!provider) {
      return
    }

    if (!(!!provider.prototype && !!provider.prototype.constructor.name)) {
      throw "No 'constructor' method found for provider: " + provider
    }

    this.providers.push(provider)
  }

  register (i) {
    return this.execute('register', i);
  }

  boot (i) {
    return this.execute('boot', i);
  }

  execute (method, i) {
    if (typeof this.providers[i] === 'undefined') { 
      return Promise.resolve(1)
    }

    var instance = new this.providers[i];


    if (typeof instance[method] !== 'function') {
      return this[method](i + 1)
    }


    return Promise.resolve(instance[method]()).then(() => {
      return this[method](i + 1)
    })

  }
};
