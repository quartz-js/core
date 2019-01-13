import { Attributes } from '../src/index'

describe('BaseAttribute', () => {
  test('should be settable', () => {
    expect(new Attributes.Base('foo').getName()).toEqual('foo');
    expect(new Attributes.Base().setName('foo').getName()).toEqual('foo');
    expect(new Attributes.Base().setDescription('foo').getDescription()).toEqual('foo');
  });
});

describe('SwitchAttribute', () => {
  test('should be settable', () => {
    expect(new Attributes.Switch('foo').options[0].value).toEqual(0);
    expect(new Attributes.Switch('foo').options[1].value).toEqual(1);
  });
});