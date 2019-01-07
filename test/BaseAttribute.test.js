import { Attributes } from '../src/index'

describe('BaseAttribute', () => {
  test('should be settable', () => {
    expect(new Attributes.Base('foo').getName()).toEqual('foo');
  });
});