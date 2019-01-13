import { Attributes } from '@/index.js'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import QText from '@/components/Input/Text'
import Vue from 'vue'

import QuartzCore from '@/index.js'
Vue.use(QuartzCore)

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

describe('InputSwitch', () => {
  test('should render content correctly', () => {
    const wrapper = mount(QText, {
    	propsData: {
    		value: { yo: 1 },
			errors: [],
			attribute: new Attributes.Switch('yo')
    	}
    });
    expect(wrapper.text()).toEqual(
      'hello I am a card :)'
    );
  });
});