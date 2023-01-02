import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './MultipleValueTextInput.module.css';
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
	const nonCharacterKeyLabels: string[] = ['Enter','Tab']
	const delimiters: string[] = submitKeys.filter( ( element ) => !nonCharacterKeyLabels.includes( element ) );
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
	const handleItemsAdd = (addedValues: string[]) => {
		let uniqueValues: string[] = []
		addedValues.forEach((addedValue) => {
			if (addedValue && !values.includes(addedValue) && !uniqueValues.includes(addedValue)) {
				uniqueValues = uniqueValues.concat(addedValue)
			}
		})
		if (uniqueValues.length > 0) {
			const newValues = values.concat(uniqueValues)
			setValues(newValues)
			setValue('')
			uniqueValues.forEach((addedValue) => {
				onItemAdded(addedValue, newValues)
			})
		} else {
			setValue('')
		}
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

	const splitMulti = (str: string) => {
		const tempChar = delimiters[0] // We can use the first token as a temporary join character
		let result: string = str
		for (let i = 1; i < delimiters.length; i+=1) {
			result = result.split(delimiters[i]).join(tempChar) // Handle scenarios where pasted text has more than one submitKeys in it
		}
		return result.split(tempChar)
	}

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pastedText = e.clipboardData.getData('text/plain')
		let areSubmitKeysPresent = false
		delimiters.forEach((delimiter) => {
			if(pastedText.includes(delimiter)) {
				areSubmitKeysPresent = true
			}
		})
		if (areSubmitKeysPresent) {
			const splitTerms = splitMulti(pastedText)
			if (splitTerms.length > 0) {
				e.preventDefault()
				handleItemsAdd(splitTerms)
			}
		}
	}

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
			<label
				htmlFor={name}
				className={`${labelClassName} ${styles.inputLabel}`}
				data-testid="label"
			>
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
					onPaste={handlePaste}
					onBlur={handleBlur}
					className={`${className} ${styles.inputElement}`}
					{...forwardedProps}
				/>
			</label>
		</div>
	);
}

MultipleValueTextInput.propTypes = propTypes;
export default MultipleValueTextInput;
