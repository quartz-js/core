import { container } from '../app/Container'

export class Interceptor {
  static storage (name, value) {
    let data = container.get('interceptor')

    if (!data) {
      container.set('interceptor', [])
      data = [];
    }

    if (typeof data[name] === "undefined") {
      data[name] = [];
    }

    if (value) {
      data[name].push(value)
      container.set('interceptor', data)
    }

    return data[name]
  }

  static add(name, closure) {
    Interceptor.storage(name, closure)
  }

  static resolve (name, data) {
    Interceptor.storage(name).map(interceptor => {
      data = interceptor(data)
    })

    return data
  }
}
