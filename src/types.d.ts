import { ReactNode } from 'react';

export interface MultipleValueTextInputProps {
	/** Any values the input's collection should be prepopulated with. */
	values?: string[];
	/** Method which should be called when an item is added to the collection */
	onItemAdded?: (newItem: string, resultItems: string[]) => void;
	/** Method which should be called when an item is removed from the collection */
	onItemDeleted?: (deletedItem: string, resultItems: string[]) => void;
	/** Label to be attached to the input, if desired */
	label?: string;
	/** Name attribute for the input */
	name?: string;
	/** Placeholder attribute for the input, if desired */
	placeholder?: string;
	/** ASCII charcode for the keys which should
	 * trigger an item to be added to the collection (defaults to comma (44) and Enter (13))
	 */
	submitKeys?: string[];
	/** JSX or string which will be used as the control to delete an item from the collection */
	deleteButton?: ReactNode;
	/** Whether or not the blur event should trigger the added-item handler */
	shouldAddOnBlur?: boolean;
	/** Custom class name for the input element */
	className?: string;
	/** Custom class name for the input label element */
	labelClassName?: string;
	[x: string]: unknown;
}

export interface MultipleValueTextInputItemProps {
	value: string;
	handleItemRemove: (removedValue: string) => void;
	deleteButton: ReactNode;
}
