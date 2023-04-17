### Basic example:

```js
<MultipleValueTextInput
	onItemAdded={(item, allItems) => console.log(`Item added: ${item}`)}
	onItemDeleted={(item, allItems) => console.log(`Item removed: ${item}`)}
	label="Items"
	name="item-input"
	placeholder="Enter whatever items you want; separate them with COMMA or ENTER."
/>
```

### Custom delete button:

```js
<MultipleValueTextInput
	onItemAdded={(item, allItems) => console.log(`Item added: ${item}`)}
	onItemDeleted={(item, allItems) => console.log(`Item removed: ${item}`)}
	label="Items"
	name="item-input"
	placeholder="Enter whatever items you want; separate them with COMMA or ENTER."
	deleteButton={<span>(delete)</span>}
/>
```

### Populate initial values

```js
<MultipleValueTextInput
	onItemAdded={(item, allItems) => console.log(`Item added: ${item}`)}
	onItemDeleted={(item, allItems) => console.log(`Item removed: ${item}`)}
	label="Items"
	name="item-input"
	placeholder="Enter whatever items you want; separate them with COMMA or ENTER."
	values={['default value', 'another default value']}
/>
```

### Custom delimiter

```js
<MultipleValueTextInput
	onItemAdded={(item, allItems) => console.log(`Item added: ${item}`)}
	onItemDeleted={(item, allItems) => console.log(`Item removed: ${item}`)}
	label="Items"
	name="item-input"
	submitKeys={[' ']}
	placeholder="Enter whatever items you want; separate them with SPACE."
/>
```

### Add field content on blur

```js
<MultipleValueTextInput
	onItemAdded={(item, allItems) => console.log(`Item added: ${item}`)}
	onItemDeleted={(item, allItems) => console.log(`Item removed: ${item}`)}
	label="Items"
	name="item-input"
	shouldAddOnBlur={true}
	placeholder="Enter whatever items you want; deselect/blur the input to add item and start a new one."
/>
```

### Populate values dynamically

```js
const [values, setValues] = React.useState([]);
const populateValuesDynamically = () => {
	setValues(['test1', 'test2', 'test3']);
};

<div>
	<button type="button" onClick={populateValuesDynamically}>
		Populate Some Data
	</button>
	<MultipleValueTextInput
		label="Items"
		name="item-input"
		placeholder="Enter whatever items you want; separate them with COMMA or ENTER. Or click the button to populate dynamically."
		onItemAdded={(_, resultItems) => setValues(resultItems)}
		onItemDeleted={(_, resultItems) => setValues(resultItems)}
		values={values}
	/>
</div>;
```
