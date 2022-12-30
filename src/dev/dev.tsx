import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import MultipleValueTextInput from '../index';

const DevEnvironmentApp = () => {
	const [values, setValues] = useState<string[]>([]);

	return (
		<div>
			<h1>React Multivalue Test Input Testing Environment</h1>
			<p>{values.length} values entered.</p>
			<MultipleValueTextInput
				className="test-input"
				deleteButton={<span>(close)</span>}
				label="My Input"
				labelClassName="test-input-label"
				name="my-input"
				placeholder="Separate values with comma"
				onItemAdded={(_, resultItems) => setValues(resultItems)}
				onItemDeleted={(_, resultItems) => setValues(resultItems)}
			/>
		</div>
	);
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<DevEnvironmentApp />);
