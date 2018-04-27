import React from 'react';
import { shallow } from 'enzyme';
import MultipleValueTextInput from '../MultipleValueTextInput';
import MultipleValueTextInputItem from '../MultipleValueTextInputItem';

const createTestProps = propOverrides => ({
	// common props
	onItemAdded: jest.fn(),
	onItemDeleted: jest.fn(),
	name: 'test-input',
	...propOverrides
});

describe('rendering', () => {
	it('should render valid snapshot with default props', () => {
		const props = createTestProps();
		const input = shallow(<MultipleValueTextInput {...props} />);
		expect(input).toMatchSnapshot();
	});
	it('should render valid snapshot with passed props', () => {
		const props = createTestProps({ label: 'Test Label', placeholder: 'Test Placeholder' });
		const input = shallow(<MultipleValueTextInput {...props} />);
		expect(input).toMatchSnapshot();
	});
	it('should render with default props', () => {
		const props = createTestProps();
		const input = shallow(<MultipleValueTextInput {...props} />);
		expect(input.find(MultipleValueTextInputItem)).toHaveLength(0);
		expect(input.find('label')).toHaveText('');
		expect(input.find('input')).toHaveProp('name', 'test-input');
		expect(input.find('input')).toHaveProp('placeholder', '');
		expect(input.find('input')).toHaveValue('');
	});
	it('should render with passed props', () => {
		const props = createTestProps({ label: 'Test Label', placeholder: 'Test Placeholder' });
		const input = shallow(<MultipleValueTextInput {...props} />);
		expect(input.find(MultipleValueTextInputItem)).toHaveLength(0);
		expect(input.find('label')).toHaveText('Test Label');
		expect(input.find('input')).toHaveProp('name', 'test-input');
		expect(input.find('input')).toHaveProp('placeholder', 'Test Placeholder');
		expect(input.find('input')).toHaveValue('');
	});
	it('should render items', () => {
		const props = createTestProps({ values: ['1', '2', '3'] });
		const input = shallow(<MultipleValueTextInput {...props} />);
		expect(input.find(MultipleValueTextInputItem)).toHaveLength(3);
	});
	it('should forward props to input', () => {
		const props = createTestProps({ 'data-test': 'test' });
		const input = shallow(<MultipleValueTextInput {...props} />);
		expect(input.find('input')).toHaveProp('data-test', 'test');
	});
	it('should forward props to item', () => {
		const props = createTestProps({ values: ['1'], deleteButton: 'blah' });
		const input = shallow(<MultipleValueTextInput {...props} />);
		const item = input.find(MultipleValueTextInputItem).first();
		expect(item).toHaveValue('1');
		expect(item).toHaveProp('deleteButton', 'blah');
	});
});

describe('behavior', () => {
	it('should set value on change', () => {
		const props = createTestProps();
		const input = shallow(<MultipleValueTextInput {...props} />);
		input.find('input').simulate('change', { target: { value: 'abc' } });
		expect(input.find('input')).toHaveProp('value', 'abc');
	});
	it('should handle default char codes to add values', () => {
		const onItemAdd = jest.fn();
		const enterEvent = { preventDefault: () => { }, charCode: 13, target: { value: '1' } };
		const commaEvent = { preventDefault: () => { }, charCode: 44, target: { value: '2' } };
		const otherEvent = { preventDefault: () => { }, charCode: 10, target: { value: '3' } };
		const props = createTestProps({ onItemAdded: onItemAdd });
		const input = shallow(<MultipleValueTextInput {...props} />);
		input.find('input').simulate('keyPress', enterEvent);
		input.find('input').simulate('keyPress', commaEvent);
		input.find('input').simulate('keyPress', otherEvent);
		expect(onItemAdd).toHaveBeenCalledTimes(2);
	});
	it('should handle custom char codes to add values', () => {
		const onItemAdd = jest.fn();
		const customEvent1 = { preventDefault: () => { }, charCode: 10, target: { value: '1' } };
		const customEvent2 = { preventDefault: () => { }, charCode: 20, target: { value: '2' } };
		const commaEvent = { preventDefault: () => { }, charCode: 30, target: { value: '3' } };
		const props = createTestProps({ onItemAdded: onItemAdd, charCodes: [10, 20] });
		const input = shallow(<MultipleValueTextInput {...props} />);
		input.find('input').simulate('keyPress', customEvent1);
		input.find('input').simulate('keyPress', customEvent2);
		input.find('input').simulate('keyPress', commaEvent);
		expect(onItemAdd).toHaveBeenCalledTimes(2);
	});
	it('should update state on add', () => {
		const enterEvent = { preventDefault: () => { }, charCode: 13, target: { value: 'abc' } };
		const props = createTestProps({ values: ['1', '2'] });
		const input = shallow(<MultipleValueTextInput {...props} />);
		input.find('input').simulate('change', { target: { value: 'abc' } });
		input.find('input').simulate('keyPress', enterEvent);
		expect(input.find('input')).toHaveProp('value', '');
		expect(input.find(MultipleValueTextInputItem)).toHaveLength(3);
	});
	it('should ignore duplicates', () => {
		const enterEvent = { preventDefault: () => { }, charCode: 13, target: { value: '1' } };
		const props = createTestProps({ values: ['1', '2'] });
		const input = shallow(<MultipleValueTextInput {...props} />);
		input.find('input').simulate('change', { target: { value: '1' } });
		input.find('input').simulate('keyPress', enterEvent);
		expect(input.find('input')).toHaveProp('value', '');
		expect(input.find(MultipleValueTextInputItem)).toHaveLength(2);
	});
	it('should call external remove method', () => {
		const onItemDelete = jest.fn();
		const props = createTestProps({ onItemDeleted: onItemDelete, values: ['1', '2'] });
		const input = shallow(<MultipleValueTextInput {...props} />);
		input.instance().handleItemRemove('1');
		expect(onItemDelete).toHaveBeenCalledTimes(1);
	});
	it('should remove items from state', () => {
		const props = createTestProps({ values: ['1', '2'] });
		const input = shallow(<MultipleValueTextInput {...props} />);
		input.instance().handleItemRemove('1');
		input.update();
		expect(input.find(MultipleValueTextInputItem)).toHaveLength(1);
	});
});
