import React, { ReactElement } from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultipleValueTextInputProps } from '../../types';
import MultipleValueTextInput from '../MultipleValueTextInput';

const createTestProps = (propOverrides?: MultipleValueTextInputProps) => ({
	// common props
	onItemAdded: jest.fn(),
	onItemDeleted: jest.fn(),
	name: 'test-input',
	...propOverrides
});
const renderWithUserInteraction = (jsx: ReactElement) => ({
	user: userEvent.setup(),
	...render(jsx)
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
	it('should allow user to add item with default submitKeys', async () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd });
		const { user, getByRole, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const initialItems = queryAllByRole('listitem');
		expect(initialItems.length).toBe(0);
		await user.click(input);
		await user.keyboard('abc,');
		await user.click(input);
		await user.keyboard('abc2{Enter}');
		await waitFor(() => {
			expect(onItemAdd).toHaveBeenCalledTimes(2);
			const items = queryAllByRole('listitem');
			expect(items).toHaveLength(2);
			expect(items[0]).toHaveTextContent('abc');
			expect(items[1]).toHaveTextContent('abc2');
		});
	});
	it('should allow user to add item with custom submitKeys', async () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd, submitKeys: [' '] });
		const { user, getByRole, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const initialItems = queryAllByRole('listitem');
		expect(initialItems.length).toBe(0);
		await user.click(input);
		await user.keyboard('abc ');
		await user.click(input);
		await user.keyboard('abc2{Enter}');
		await waitFor(() => {
			expect(onItemAdd).toHaveBeenCalledTimes(1);
			const items = queryAllByRole('listitem');
			expect(items).toHaveLength(1);
			expect(items[0]).toHaveTextContent('abc');
		});
	});
	it('should not allow user to add item which already exists', async () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd });
		const { user, getByRole, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const initialItems = queryAllByRole('listitem');
		expect(initialItems.length).toBe(0);
		await user.click(input);
		await user.keyboard('abc,');
		await user.click(input);
		await user.keyboard('abc,');
		await waitFor(() => {
			expect(onItemAdd).toHaveBeenCalledTimes(1);
			const items = queryAllByRole('listitem');
			expect(items).toHaveLength(1);
			expect(items[0]).toHaveTextContent('abc');
		});
	});
	it('should remove item on delete button click', async () => {
		const onItemDelete = jest.fn();
		const props = createTestProps({ onItemDeleted: onItemDelete, values: ['1', '2'] });
		const { user, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const items = queryAllByRole('listitem');
		const button = within(items[0]).getByRole('button');
		await user.click(button);
		waitFor(() => {
			expect(onItemDelete).toHaveBeenCalledTimes(1);
			expect(items).toHaveLength(1);
		});
	});
	it('should handle blur to add values when applicable', async () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd, shouldAddOnBlur: true });
		const { user, getByRole, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const initialItems = queryAllByRole('listitem');
		expect(initialItems).toHaveLength(0);
		await user.click(input);
		await user.keyboard('test{Tab}');
		waitFor(() => {
			expect(onItemAdd).toHaveBeenCalledTimes(1);
			expect(onItemAdd).toHaveBeenLastCalledWith('test', ['test']);
			const items = queryAllByRole('listitem');
			expect(items).toHaveLength(1);
			expect(items[0]).toHaveTextContent('test');
		});
	});
	it('should not add on blur when disabled', async () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd });
		const { user, getByRole, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const initialItems = queryAllByRole('listitem');
		expect(initialItems).toHaveLength(0);
		await user.click(input);
		await user.keyboard('test{Tab}');
		waitFor(() => {
			expect(onItemAdd).toHaveBeenCalledTimes(0);
			const items = queryAllByRole('listitem');
			expect(items).toHaveLength(0);
		});
	});
	it('should allow user to add multiple unique items from clipboard if submitkeys are present', async () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd, submitKeys: [",",";"], values: ["input3"] });
		const { user, getByRole, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const initialItems = queryAllByRole('listitem');
		expect(initialItems.length).toBe(1);
		await user.click(input);
		await user.paste("input1,input2;input3,input4,,input5,input1;");
		await waitFor(() => {
			expect(onItemAdd).toHaveBeenCalledTimes(4);
			// const items = queryAllByRole('listitem');
			// expect(items).toHaveLength(5);
			// expect(items[0]).toHaveTextContent('input1');
			// expect(items[1]).toHaveTextContent('input2');
			// expect(items[2]).toHaveTextContent('input4');
			// expect(items[3]).toHaveTextContent('input5');
			expect(input).toHaveValue("")
		});
	});
	it('should allow user to view text from clipboard if submitkeys are not present', async () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd, submitKeys: [",",";"] });
		const { user, getByRole, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const initialItems = queryAllByRole('listitem');
		expect(initialItems.length).toBe(0);
		await user.click(input);
		await user.paste("john doe");
		await waitFor(() => {
			expect(onItemAdd).toHaveBeenCalledTimes(0);
			const items = queryAllByRole('listitem');
			expect(items).toHaveLength(0);
			expect(input).toHaveValue("john doe")
		});
	});
	it('should ignore non-character submit keys from being recognized as delimiters in copied text', async () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd, submitKeys: [",","Enter","Tab"] });
		const { user, getByRole, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const initialItems = queryAllByRole('listitem');
		expect(initialItems.length).toBe(0);
		await user.click(input);
		await user.paste("My Tablet is about to Enter the door");
		await waitFor(() => {
			expect(onItemAdd).toHaveBeenCalledTimes(0);
			const items = queryAllByRole('listitem');
			expect(items).toHaveLength(0);
			expect(input).toHaveValue("My Tablet is about to Enter the door")
		});
	});
	it('should selectively ignore non-character submit keys from being recognized as delimiters in copied text', async () => {
		const onItemAdd = jest.fn();
		const props = createTestProps({ onItemAdded: onItemAdd, submitKeys: [",","Enter","Tab"] });
		const { user, getByRole, queryAllByRole } = renderWithUserInteraction(
			<MultipleValueTextInput {...props} />
		);
		const input = getByRole('textbox');
		const initialItems = queryAllByRole('listitem');
		expect(initialItems.length).toBe(0);
		await user.click(input);
		await user.paste("My Tablet is about to Enter the door, value1, value2");
		await waitFor(() => {
			expect(onItemAdd).toHaveBeenCalledTimes(3);
			const items = queryAllByRole('listitem');
			expect(items).toHaveLength(3);
			expect(items[0]).toHaveTextContent('My Tablet is about to Enter the door');
			expect(items[1]).toHaveTextContent('value1');
			expect(items[2]).toHaveTextContent('value2');
			expect(input).toHaveValue("")
		});
	});
});
