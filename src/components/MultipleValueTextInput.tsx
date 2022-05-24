import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/styles.css';
import { MultipleValueTextInputProps } from '../types';
import MultipleValueTextInputItem from './MultipleValueTextInputItem';

const propTypes = {
	/** Any values the input's collection should be prepopulated with. */
	values: PropTypes.arrayOf(PropTypes.string),
	/** Method which should be called when an item is added to the collection */
	onItemAdded: PropTypes.func.isRequired,
	/** Method which should be called when an item is removed from the collection */
	onItemDeleted: PropTypes.func.isRequired,
	/** Label to be attached to the input, if desired */
	label: PropTypes.string,
	/** Name attribute for the input */
	name: PropTypes.string.isRequired,
	/** Placeholder attribute for the input, if desired */
	placeholder: PropTypes.string,
	/** ASCII charcode for the keys which should
	 * trigger an item to be added to the collection (defaults to comma (44) and Enter (13))
	 */
	submitKeys: PropTypes.arrayOf(PropTypes.string),
	/** JSX or string which will be used as the control to delete an item from the collection */
	deleteButton: PropTypes.node,
	/** Whether or not the blur event should trigger the added-item handler */
	shouldAddOnBlur: PropTypes.bool,
	/** Custom class name for the input element */
	className: PropTypes.string,
	/** Custom class name for the input label element */
	labelClassName: PropTypes.string
};

/**
 * A text input component for React which maintains and displays a collection
 * of entered values as an array of strings.
 */
function MultipleValueTextInput({
	placeholder = '',
	label = '',
	name,
	deleteButton = <span>&times;</span>,
	onItemAdded = () => null,
	onItemDeleted = () => null,
	className = '',
	labelClassName = '',
	submitKeys = ['Enter', ','],
	values: initialValues = [],
	shouldAddOnBlur,
	...forwardedProps
}: MultipleValueTextInputProps) {
	const [values, setValues] = useState(initialValues);
	const [value, setValue] = useState('');
	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.currentTarget.value);
	};
	const handleItemAdd = (addedValue: string) => {
		if (values.includes(addedValue) || !addedValue) {
			setValue('');
			return;
		}
		const newValues = values.concat(addedValue);
		setValues(newValues);
		setValue('');
		onItemAdded(value, newValues);
	};
	const handleItemRemove = (removedValue: string) => {
		const currentValues = values;
		const newValues = currentValues.filter((v) => v !== removedValue);
		onItemDeleted(removedValue, newValues);
		setValues(newValues);
	};

	const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// Defaults: Enter, Comma (e.key === 'Enter' or ',')
		if (submitKeys.includes(e.key)) {
			e.preventDefault();
			handleItemAdd(e.currentTarget.value);
		}
	};
	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (shouldAddOnBlur) {
			e.preventDefault();
			handleItemAdd(e.target.value);
		}
	};
	const valueDisplays = values.map((v) => (
		<MultipleValueTextInputItem
			value={v}
			key={v}
			deleteButton={deleteButton}
			handleItemRemove={handleItemRemove}
		/>
	));
	return (
		<div className="multiple-value-text-input" role="form">
			<label htmlFor={name} className={labelClassName} data-testid="label">
				{label}
				<div className="multiple-value-text-input-item-container">
					{values.length > 0 && <p role="list">{valueDisplays}</p>}
				</div>
				<input
					aria-label={label}
					name={name}
					placeholder={placeholder}
					value={value}
					type="text"
					onKeyPress={handleKeypress}
					onChange={handleValueChange}
					onBlur={handleBlur}
					className={className}
					{...forwardedProps}
				/>
			</label>
		</div>
	);
}

MultipleValueTextInput.propTypes = propTypes;
export default MultipleValueTextInput;
