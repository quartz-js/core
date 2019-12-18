import { container } from '../app/Container'

export class Hook
{
  constructor () {
    this.hooks = []
  }

  add($event, callback)
  {
    if (typeof this.hooks[$event] === "undefined") {
      this.hooks[$event] = [];
    }

    this.hooks[$event].push(callback)
  }

  get($event, data)
  { 
    return typeof this.hooks[$event] !== "undefined" ? this.hooks[$event] : [];
  }

  execute($event, data)
  {
    var hooks = this.get($event, data);

    return hooks.reduce(function (prev, curr) {
      return prev.then((data) => {
        return curr(data);
      });
    }, Promise.resolve(data));
  }
}
