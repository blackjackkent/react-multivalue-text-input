import React from 'react';
import { shallow } from 'enzyme';
import MultipleValueTextInputItem from '../MultipleValueTextInputItem';

const createTestProps = (propOverrides) => ({
	// common props
	value: 'test',
	handleItemRemove: jest.fn(),
	deleteButton: 'test-delete',
	...propOverrides
});

describe('rendering', () => {
	it('should render valid snapshot', () => {
		const props = createTestProps();
		const item = shallow(<MultipleValueTextInputItem {...props} />);
		expect(item).toMatchSnapshot();
	});
	it('should render with passed props', () => {
		const props = createTestProps();
		const item = shallow(<MultipleValueTextInputItem {...props} />);
		expect(item.find('.multiple-value-text-input-item')).toHaveLength(1);
		expect(item.find('.multiple-value-text-input-item')).toIncludeText('test');
		expect(item.find('.multiple-value-text-input-item-delete-button')).toHaveLength(1);
		const button = item.find('.multiple-value-text-input-item-delete-button');
		expect(button).toHaveText('test-delete');
		expect(button).toHaveProp('data-value', 'test');
	});
});
describe('behavior', () => {
	it('should handle delete action onkeypress', () => {
		const onDelete = jest.fn();
		const props = createTestProps({ handleItemRemove: onDelete });
		const item = shallow(<MultipleValueTextInputItem {...props} />);
		item.find('.multiple-value-text-input-item-delete-button').simulate('keyPress');
		expect(onDelete).toHaveBeenCalledTimes(1);
	});
	it('should handle delete action onclick', () => {
		const onDelete = jest.fn();
		const props = createTestProps({ handleItemRemove: onDelete });
		const item = shallow(<MultipleValueTextInputItem {...props} />);
		item.find('.multiple-value-text-input-item-delete-button').simulate('click');
		expect(onDelete).toHaveBeenCalledTimes(1);
	});
});
