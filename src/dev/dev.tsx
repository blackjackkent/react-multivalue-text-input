import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import MultipleValueTextInput from '../index';

const DevEnvironmentApp = () => {
	const [values, setValues] = useState<string[]>([]);
	const populateValuesDynamically = () => {
		setValues(['test1', 'test2', 'test3']);
	};

	return (
		<div style={{ width: '50%', margin: 'auto' }}>
			<h1>React Multivalue Test Input Testing Environment</h1>
			<p>{values.length} values entered.</p>
			<button type="button" onClick={populateValuesDynamically}>
				Populate Some Data
			</button>
			<MultipleValueTextInput
				className="test-input"
				deleteButton={<span>(close)</span>}
				label="My Input"
				labelClassName="test-input-label"
				name="my-input"
				placeholder="Separate values with comma"
				onItemAdded={(_, resultItems) => setValues(resultItems)}
				onItemDeleted={(_, resultItems) => setValues(resultItems)}
				values={values}
			/>
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<DevEnvironmentApp />);
