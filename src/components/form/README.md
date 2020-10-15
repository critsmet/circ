# The Form Component and its Input Components

To maximize reusability, this collection of customizable components work together to make state management of form inputs easy.

## Contents

- [The Form Component](#the-form-component)
- [Input Components](#input-components)
  - [Common Functionality](#common-functionality)
  - [Checkbox](#checkbox)
  - [Checkbox Collection](#checkbox-collection)
  - [DateField](#datefield)
  - [Dropwdown](#dropdown)
  - [TagField](#tagfield)
  - [TextField](#textfield)
  - [TimeField](#timefield)

## Form

The `Form` component is essentially the Provider for a context specifically made for forms using React's `React.createContext()` method. The `Provider` gives consumer components access to a state created in the component using the `useReducer` hook, and also the `setState` function that accepts an object sent to the reducer in order to change the state. The reducer passed in to the `useReducer` hook has an initial state of an empty object, and simple `switch` statement which handles just three `action.type`s for its `case` statements: `ADD_FIELD`, `UPDATE_STATE`, and `REMOVE_FIELD`. The `Provider` also gives components access to the `useRegisterWithFormContext` hook, which each child input component will call to 'register itself' with its initial values using the `ADD_FIELD` action type. Separate contexts will be made if you have more than one form rendered at the same time, so there inputs will not get combined into the same object.

The `Form` component will ultimately render what's passed to it via the `render` prop, and will provide the current `state` value as the argument to the function in the render prop so that state values can be used amongst sibling input components as well as used to determine when the form has passed all validators and is ready to submit. It's important to note that all of the children inside of the `Form` component need to also be wrapped inside of a `form` html tag, and use the `onSubmit` event listener to handle submission of the form. In other words, the main purpose of the `Form` component is to manage all input values of the form, and deciding what to do with the form values is totally customizable.

Consider the following example:

```
import React from 'react'

import { Form } from '../form/Form'
import TextField from '../form/TextField'

export default function BlogForm(){

  function handleSubmit(e, state){
    e.preventDefault()

    //Use state data and write logic to determine where you'd like the information to go.
    //For example, make an async request.
    //You can also run a quick function to check to see if all the values have been approved, or if there were any errors.
    //Because we're not passing in any validators here, we can expect that all input values are valid
    //For the purpose of writing out an example, you could do something like this:

    if (Object.values(state).find(obj => obj.errors.length > 0) || Object.values(state).find(obj => obj.approved === false)){
      alert("You have errors and your inputs are not approved! Review them and try submitting again")
    } else {
      fetch(URL_GOES_HERE, {
        method: "POST",
        body: JSON.stringify({text: state.text.value, post: state.post.value}),
        headers: ENTER_HEADERS
      }).then(res => ...)
    }
  }

  //Begin writing form
  return(
    <Form render={state => {
      <TextField name="title" />
      <TextField type="textarea" name="post" />
    }}/>
  )  
}

```

Both `TextField` components will run the `useRegisterWithFormContext` hook right upon rendering and pass in an object with the `name`, `defaultValue`, and `defaultApproval` as keys and their respective values. The `useRegisterWithFormContext`hook runs the following code, which creates new fields in the state for each of the input components:

```
setState({type:"ADD_FIELD", payload: {[name]: {...stateObjTemplate, value: defaultValue, approved: defaultApproval}}})
```

This results in the following value being held by the Form component's state created by `useReducer`:

```
//State object:
{
  title: {value: "", approved: false, errors: []},
  post: {value: "", approved: false, errors: []}
}
```

You can `import { FormContext } from ./Form` and follow the pattern above to make your own components, but all the following components were built to connect with the `Form ` component's context.

## Input Components

### Common Functionality

All of the input components designed to 'connect' their values to the state of the `Form` component have almost identical procedures that take place in the first several lines of code. Let's look at the `Dropdown` component code as an example:

```
import React, { useContext, useEffect } from 'react'

import { FormContext } from './Form'

export default function Dropdown({name='dropdown', placeholder="Select", divClassNames='', collection=[], defaultValue=0, selectClassNames='', required=true})){

  //1. The component uses the useContext hook to connect to the context provided by the Provider in the Form component

  const {setState, state, useRegisterWithFormContext} = useContext(FormContext)

  //2. A variable called 'value' is declared, and is assigned the value of either what's being held in state or the defaultValue argument passed in
  // This 'value' variable will be used throughout the component to render the correct input value
  //  If this is the component's first render, we obviously have not registered with the Form store's context...which happens next.
  //  In the case of the first render, then, we'll go with the default value
  // Once the input value is registered with the Form context's state and changes, the value variable will reflect that value instead of the default value.

  let value = state[name] ? state[name].value : defaultValue

  //3. The useRegisterWithFormContext hook is called only when the component first mounts, and is responsible for 'registering' this component with the state from the Form component's context.
  //  The 'name' argument is used to determine the key in state, so it's important that they're named differently
  //  The state will now have a new key 'dropdown' with the value of {value: 0, approved: false, errors: []}

  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: !required})

  //4. This useEffect is meant to update the value of the input field if asynchronous data arrives after the form has been composed and passed in as the defaultValue prop.
  //  Because useEffect runs on every render, we have to distinguish whether the default value has changed, and more specifically, to a value that would be considered an approved value.
  //  If your data requires going through validations, make sure the data that comes in to the form's value has been through a validator already.
  //  The form cannot run validators on default values. More on validators in the TextField section below.
  //  In this case, because the dropdown's default value is 0, a default value that were to arrive to the component later that isn't 0 would cause the component to update its value in the Form context's state.

  useEffect(() => {
    defaultValue !== 0 && setState({type: "UPDATE_STATE", name, payload: {value: defaultValue, approved: true}})
  }, [defaultValue])

  //...logic for the rest of the component.
}

```

Every component performs this ceremony of 'reporting' to the `Form` context's state, determining the most accurate value to be used in the rest of the component, and then preparing for a possible change of the defaultValue prop if asynchronous data wants to populate the value of the input.

While there is still similar processes that each component will proceed to do, they are distinct enough to discuss their logic separately, so lets get into each of the components themselves.

The `hanldeOnChange` callback function for the `onChange` event listener simply toggles the value in state to its opposite value, and sets the approved value to `true` if the checkmark being checked is required.

### Checkbox

The `Checkbox` is a fairly simple component that takes in the following props:

`name` - used as the key in the `Form` context's state, defaults to 'checkbox'
`labelText` - the text that will appear as the label next to the checkbox, and will default to the name if left blank
`labelClassNames` - a string of class names applied to the label tag that wraps the checkbox
`checkboxClassNames` - a string of class names applied to the input tag itself
`defaultValue` - should either be true or false, and will start the checkbox off with that value
`required` - should either be true or false and will determine whether the value must be true or can be false

It's important to note that the `Checkbox` component is composed of a checkbox input wrapped in a label element. This makes custom checkbox design possible following the directions in [this w2schools tutorial](https://www.w3schools.com/howto/howto_css_custom_checkbox.asp).

### Checkbox Collection

The `Checkbox Collection` component takes in the following props:

`name` - used as the key in the `Form` context's state, defaults to 'checkbox-collection'
`containerLabelText` - text that will act as the label for the entire collection of checkboxes
`containerLabelClassNames` - a string of class names applied to the label mentioned above
`divClassNames` - a string of class names applied to the div containing all of the checkbox inputs
`collection` - an array of objects with keys of `id` and `name` that will be used to create the checkbox options
`defaultValue` - an array of ids that correspond with the ids in the collection that should be pre-checked
labelClassNames
`labelClassNames` - a string of class names applied to the labels of each checkbox input
`checkboxClassNames` - a string of class names applied to each of the individual checkbox inputs
`counter` - accepts a boolean value that will render a counter that takes of %5 of the entire component next to the checkbox collection container
`counterSpanClassNames`- applied to the counter element rendered if the above value is `true`
`limit` - an integer that determines how many checkboxes are allowed to be selected
`required` - a boolean value determining whether _at least one_ checkbox in the collection needs to be checked.

As with the `Checkbox` component, it's important to note that each individual checkbox is composed of a checkbox input wrapped in a label element. This makes custom checkbox design possible following the directions in [this w2schools tutorial](https://www.w3schools.com/howto/howto_css_custom_checkbox.asp).

The checkboxes are composed with their ids being their values and their names being their labels displayed next to the checkbox.

The `handleOnChange` callback function for the `onChange` event listener parses the string of the selected input to an integer, makes sure that the value is _actually_ in the original collection (this prevents people from tampering with the HTML and making their own checkboxes), and then updates the state value – an array – to include the new value.

### DateField

The `DateField` component is a very powerful component used to select a day, month, and year value that together compose a date. It accepts the following props:

`name` - used as the key in the `Form` context's state, defaults to 'date'
`labelText` - appears to the left of the date-selection container
`labelClassNames` - a string of class names applied to the text to the left of the date selection container
`defaultYear` - an integer that will be the year that the year selector defaults to, defaults to the current year indicated by the user's browser
`defaultMonth` - an integer 1-12 that will be the month that the month selector defaults to, defaults to the current month indicated by the user's browser
`defaultDay` - an integer 1-31 – depending on the month – that the day selector defaults to, defaults to the current day indicated by the user's browser
`minYear` - an integer that sets the lower limit of year options that can be selected, , defaults to the current year indicated by the user's browser
`minMonth` - an integer 1-11 that sets the lower limit of month options that can be selected, defaults to the current month indicated by the user's browser
`minDay` - an integer 2-31 – depending on the month – that sets the lower limit of the day that can be selected, defaults to the current day indicated by the user's browser
`maxYear` - an integer that sets the upper limit of year options that can be selected, defaults to one year after the current year indicated by the user's browser
`minMonth` - an integer 2-12 that sets the upper limit of month options that can be selected, defaults to 12
`minDay` - an integer 2-31 – depending on the month – that sets the upper limit of the day that can be selected, defaults to 31
`selectorClassNames` - a string of class names applied to each of the three `select` tags that allow the year, month, and date to be selected
`divClassNames` - a string of class names applied to the container of the entire component

The `DateField` always registers with the `Form` context's state as `true` because it is expected that a valid value will be passed in as the default value, or, if no default value is provided, than it is assumed that the current date is accepted as a valid value. In fact, if the min, max, and default values are all correct, it is impossible to select in invalid date. This is because all values before the minimum date props and after the maximum date props are disabled. The dates also reconfigure themselves if a change in year invalidates a month, a change in month invalidates a day, or if someone were to try to add an extra invalid `option` in the `select` tag. The `handleOnChange` method runs whenever a value in any of the `select` tags change,  and inside runs the `dateReconfigurer` method – itself composed of several 'validator' methods that make sure that out-of-bounds dates cannot be selected. For example, if the default value is October 31st, 2020, and a user changes the date to February, then 31 is obviously not a valid day. The `dateReconfigurer` method will reset the day value to be the first day that is a valid day for February.

### Dropdown

The `Dropdown` component is also a simple component that accepts the following props:

`name` - used as the key in the `Form` context's state, defaults to 'dropwdown'
`placeholder` - text that is displayed as a disabled option at the top of the `select` element
`collection` - an array of objects with keys `id` and `name` that will become the `option` tags in the `select` element
`defaultValue` - an integer that corresponds with the id of one of the objects in the collection array that will select that option, defaults to 0 which will select the placeholder
`selectorClassNames` - a string of class names applied to the `select` element, ie the drop down
`divClassNames` - a string of class names applied to the container of the component
`required` - a boolean value indicating whether or not an option must be selected

Like the `Checkbox Collection` component, the `handleOnChange` callback function for the `onChange` event listener parses the string of the selected input to an integer, makes sure that the value is _actually_ in the original collection (this prevents people from tampering with the HTML and making their own checkboxes), and then updates the state value – an array – to include the new value.

### TagField

The `TagField` component follows common tag entry design; a string of letters turns into an isolated element separate from the input area when the spacebar is pressed, indicating the completion of a tag. This component accepts the following props:

`name` - used as the key in the `Form` context's state, defaults to 'tags'
`placeholder` - text that appears in the `input` tag before, defaults to 'Tags'
`inputClassNames` - a string of class names applied to the main `input` for the tags
`tagClassNames` - a string of class names applied to the 'tags' once they've been made
`collectionClassNames` - a string of class names applied to the collection of completed tags
`counter` - a boolean value that, if true, would render a counter taking up 5% of the entire component to the right of the `input` tag
`counterSpanClassNames`- applied to the counter element rendered if the above value is `true`
`limit` - an integer that limits the number of tags that can be made, defaults to infinity
`tagCharLimit` - an integer that limits the character length of each tag, default is 20
`divClassNames` - a string of class names applied to the container of the component
`required` - a boolean value indicating whether at least one tag must be entered

The `TagField` prevents anything other than numbers and letters to be part of the tag. Some future developments for the `TagField` component are to 1. add the ability to click tags and delete them and 2. add the ability to arrow left and highlight + erase specific tags. Because the tag collection isn't actually an input field, the cursor doesn't reach in between tags. So creating the sensation of being able to use the keyboard arrow to highlight/select and delete a tag.

### TextField

The `TextField` component is the most complex component, and it accepts the following props:

`name` - used as the key in the `Form` context's state, defaults to 'text'
`type` - a string that can be either "text" or "textarea", and will either render an `input` tag for the former or a `textarea` tag for the latter
`counter` - a boolean value that, if true, would render a counter taking up 5% of the entire component to the right of the `input` tag
`counterSpanClassNames`- applied to the counter element rendered if the above value is `true`
`limit` - an integer that is the character input limit
`placeholder` - a string that will be present in the input field when no text has been entered
`defaultValue` - a string that will populate the input field
`onChangeValidators` - an array of validators (see below) that will run the new input value in the `handleOnChange` callback function on the `onChange` event listener before adding updating the state
`continuous` - a boolean value that will allow text to continue to be entered even if it does not pass the validators in the `onChangeValidators` array.
`afterEntryValidators` - an array of validators (see below) that will run the new input value in the `handleAfterEntry` callback function on the `onKeyUp` and `onBlur` event listeners before adding updating the state
`afterEntryValidatorsTimeout` - an integer that represents the milliseconds that should elapse before running the `onKeyUp` callback function, defaults to 750
`resetDependency` - a single value that, if changed, will clear the value from state for the input and therefore the text visible
`inputClassNames` - applied to the `input` or `textarea` element, depending on the `type` prop
`disabled` - a boolean value that indicates whether the component should be disabled
`required` - a boolean value indicating whether text must be present and pass all given validators

The `TextField` component accepts validators that can run as text is being entered (onChangeValidators) or after text has been entered (afterEntryValidators). Validators must simply return an object with a key of `pass` that has a boolean as a value; and a key of `messages` that is an array of messages about why the text did not pass. This `messages` array should be empty if the entered text passes the validator.

Two helper function `runOnChangeValidators` and `runAfterEntryValidators` take each validator and pass the entered text through them. The return a final object which has a key of `pass` with a boolean value indicating whether or not the entered text passed all of the tests; and a key of `errors` with a value of an array of all of the error messages from the individual validators.

The `runAfterEntryValidators` returns an extra key called `changeValue` that can return a string which will change the value of the component in the `Form` context's state if the entered text passed all of the validators; or it will change the value of the placeholder which will be seen once the component receives the feedback that the entered text _did not_ pass all of the validators and resets the value in state to an empty string.

The `resetDependency` prop is a useful feature if, for example, this input input field was expected to hold the location of an event which could be either a physical address OR a URL (if the event were to be online). The expected input (either physical address or URL) could be determined by another input field (a Checkbox asking "is the event online?", for example). Validators could also be conditionally passed in based on whether the input is expected to be a physical address or a URL: 

`<TextField resetDependency={state.online ? state.online.value : false} afterEntryValidators={state.eventIsOnline ? ...URL Validators : ...Address Validators})>`

If a person were to enter in a physical address and it passed all the validations, but then they checked the Checkbox indicating that the event is actually going to be online and then accidentally submitting the event without adding in the URL, this would now hold incorrect data in the database and cause rendering problems. For this reason it's important to clear out the value so that a new value must be entered and go through any validators that may have been conditionally passed in specifically for it.
