import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	value: PropTypes.string.isRequired,
	handleItemRemove: PropTypes.func.isRequired,
	deleteButton: PropTypes.node.isRequired
};

const MultipleValueTextInputItem = (props) => {
	const { value, handleItemRemove, deleteButton } = props;
	return (
		<span className="multiple-value-text-input-item">
			{value}{' '}
			<span
				className="multiple-value-text-input-item-delete-button"
				data-value={value}
				tabIndex="-1"
				role="button"
				onKeyPress={() => handleItemRemove(value)}
				onClick={() => handleItemRemove(value)}
			>
				{deleteButton}
			</span>
		</span>
	);
};

MultipleValueTextInputItem.propTypes = propTypes;
export default MultipleValueTextInputItem;
