import React from 'react';
import PropTypes from 'prop-types';
import { MultipleValueTextInputItemProps } from '../types';
import styles from './MultipleValueTextInputItem.module.css';

const propTypes = {
	value: PropTypes.string.isRequired,
	handleItemRemove: PropTypes.func.isRequired,
	deleteButton: PropTypes.node.isRequired
};

const MultipleValueTextInputItem = (props: MultipleValueTextInputItemProps) => {
	const { value, handleItemRemove, deleteButton } = props;
	return (
		<span className={`multiple-value-text-input-item ${styles.inputItem}`} role="listitem">
			<span data-testid="value">{value}</span>{' '}
			<span
				className={`multiple-value-text-input-item-button ${styles.deleteButton}`}
				data-value={value}
				tabIndex={-1}
				role="button"
				onKeyUp={() => handleItemRemove(value)}
				onClick={() => handleItemRemove(value)}
			>
				{deleteButton}
			</span>
		</span>
	);
};

MultipleValueTextInputItem.propTypes = propTypes;
export default MultipleValueTextInputItem;
