import React from 'react';
import { render, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultipleValueTextInput from '../MultipleValueTextInput';

const createTestProps = (propOverrides) => ({
	// common props
	onItemAdded: jest.fn(),
	onItemDeleted: jest.fn(),
	name: 'test-input',
	...propOverrides
});

describe('default props', () => {
	it('should render valid content with default props', () => {
		const props = createTestProps();
		const { getByRole, getByTestId, queryAllByRole } = render(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const label = getByTestId('label');
		const items = queryAllByRole('listitem');
		expect(items).toHaveLength(0);
		expect(label).toHaveTextContent('');
		expect(input).toHaveAttribute('name', 'test-input');
		expect(input).toHaveAttribute('placeholder', '');
		expect(input).toHaveValue('');
	});
	it('should render with passed props', () => {
		const props = createTestProps({ label: 'Test Label', placeholder: 'Test Placeholder' });
		const { getByRole, getByTestId, queryAllByRole } = render(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const label = getByTestId('label');
		const items = queryAllByRole('listitem');
		expect(items).toHaveLength(0);
		expect(label).toHaveTextContent('Test Label');
		expect(input).toHaveAttribute('name', 'test-input');
		expect(input).toHaveAttribute('placeholder', 'Test Placeholder');
		expect(input).toHaveValue('');
	});
	it('should render items', () => {
		const props = createTestProps({ values: ['1', '2', '3'] });
		const { queryAllByRole } = render(<MultipleValueTextInput {...props} />);
		const items = queryAllByRole('listitem');
		expect(items).toHaveLength(3);
	});
	it('should forward props to input', () => {
		const props = createTestProps({ 'data-test': 'test' });
		const { getByRole } = render(<MultipleValueTextInput {...props} />);
		const input = getByRole('textbox');
		expect(input).toHaveAttribute('data-test', 'test');
	});
	it('should forward props to item', () => {
		const props = createTestProps({ values: ['1'], deleteButton: 'blah' });
		const { queryAllByRole } = render(<MultipleValueTextInput {...props} />);
		const items = queryAllByRole('listitem');
		const firstItemValue = within(items[0]).getByTestId('value');
		const firstItemButton = within(items[0]).getByRole('button');
		expect(firstItemValue).toHaveTextContent('1');
		expect(firstItemButton).toHaveTextContent('blah');
	});
});

describe('behavior', () => {
	it('should set value on change', () => {
		const props = createTestProps();
		const { getByRole } = render(<MultipleValueTextInput {...props} />);
		const input = getByRole('textbox');
		userEvent.type(input, 'abc');
		expect(input).toHaveAttribute('value', 'abc');
	});
	it('should handle default char codes to add values', () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd });
		const { getByRole } = render(<MultipleValueTextInput {...props} />);
		const input = getByRole('textbox');
		userEvent.type(input, 'abc1');
		fireEvent.keyPress(input, {
			key: 'Enter',
			code: 13,
			charCode: 13
		});
		userEvent.type(input, 'abc2');
		fireEvent.keyPress(input, {
			key: 'Comma',
			code: 44,
			charCode: 44
		});
		userEvent.type(input, 'abc3');
		fireEvent.keyPress(input, {
			key: '0',
			code: 48,
			charCode: 48
		});
		expect(onItemAdd).toHaveBeenCalledTimes(2);
	});
	it('should handle custom char codes to add values', () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd, charCodes: [57, 48] });
		const { getByRole } = render(<MultipleValueTextInput {...props} />);
		const input = getByRole('textbox');
		userEvent.type(input, 'bbb');
		fireEvent.keyPress(input, {
			key: 'Enter',
			code: 13,
			charCode: 13
		});
		userEvent.type(input, 'bbc');
		fireEvent.keyPress(input, {
			key: '9',
			code: 57,
			charCode: 57
		});
		userEvent.type(input, 'bbd');
		fireEvent.keyPress(input, {
			key: '0',
			code: 48,
			charCode: 48
		});
		expect(onItemAdd).toHaveBeenCalledTimes(2);
	});
	it('should handle blur to add values when applicable', () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd, shouldAddOnBlur: true });
		const { getByRole } = render(<MultipleValueTextInput {...props} />);
		const input = getByRole('textbox');
		userEvent.type(input, 'test');
		userEvent.tab();
		expect(onItemAdd).toHaveBeenCalledTimes(1);
		expect(onItemAdd).toHaveBeenLastCalledWith('test', ['test']);
	});
	it('should ignore blur event when not applicable', () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd, shouldAddOnBlur: false });
		const { getByRole } = render(<MultipleValueTextInput {...props} />);
		const input = getByRole('textbox');
		userEvent.type(input, 'test');
		userEvent.tab();
		expect(onItemAdd).toHaveBeenCalledTimes(0);
	});
	it('should update value list on add', () => {
		const props = createTestProps({ values: ['1', '2'] });
		const { getByRole, queryAllByRole } = render(<MultipleValueTextInput {...props} />);
		const input = getByRole('textbox');
		const items = queryAllByRole('listitem');
		userEvent.type(input, 'abc');
		fireEvent.keyPress(input, {
			key: 'Enter',
			code: 13,
			charCode: 13
		});
		waitFor(() => {
			expect(input).toHaveValue('');
			expect(items).toHaveLength(3);
		});
	});
	it('should ignore duplicates', () => {
		const props = createTestProps({ values: ['1', '2'] });
		const { getByRole, queryAllByRole } = render(<MultipleValueTextInput {...props} />);
		const input = getByRole('textbox');
		const items = queryAllByRole('listitem');
		userEvent.type(input, '1');
		fireEvent.keyPress(input, {
			key: 'Enter',
			code: 13,
			charCode: 13
		});
		waitFor(() => {
			expect(input).toHaveValue('');
			expect(items).toHaveLength(2);
		});
	});
	it('should remove items on remove button click or keypress', () => {
		const onItemDelete = jest.fn();
		const props = createTestProps({ onItemDeleted: onItemDelete, values: ['1', '2'] });
		const { queryAllByRole } = render(<MultipleValueTextInput {...props} />);
		const items = queryAllByRole('listitem');
		const button = within(items[0]).getByRole('button');
		userEvent.click(button);
		waitFor(() => {
			expect(onItemDelete).toHaveBeenCalledTimes(1);
			expect(items).toHaveLength(1);
		});
	});
});
