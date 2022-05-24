import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import MultipleValueTextInput from '../index';

const DevEnvironmentApp = () => {
	const [values, setValues] = useState([]);

	return (
		<div>
			<h1>React Multivalue Test Input Testing Environment</h1>
			<MultipleValueTextInput />
		</div>
	);
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<DevEnvironmentApp />);
