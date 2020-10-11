import React, { useContext, useEffect, useRef } from 'react'

import { FormStoreContext } from './Form'

import Validators from '../../helpers/validators'

export default function TextField({ name='text', type="text", counter=false, limit=Infinity, placeholder='', onChangeValidators=[], afterEntryValidators=[], divClassNames='', inputClassNames='', counterSpanClassNames='', defaultValue='', continuous=false, resetDependency=false, disabled=false, optional=false}){

  const textareaRef = useRef(null)
  const {setState, state, useRegisterWithFormContext} = useContext(FormStoreContext)
  let value = state[name] ? state[name].value : defaultValue
  let errors = state[name] ? state[name].errors : []

  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: optional || defaultValue !== ''})

  //The if the value of the optional resetDependency prop changes, it will clear the value of the text field
  //This is a useful feature if, for example, this input input field was expected to hold the location of an event which could be either a physical address OR a URL (if the event were to be online).
  //The expectated input (either physical address or URL) could be determined by another input field (a Checkbox asking "is the event online?", for example)
  //Validators could also be conditionally passed in based on whether the input is expected to be a physical address or a URL (ie, <TextField resetDependency={state.online ? state.online.value : false} afterEntryValidators={state.eventIsOnline ? ...URL Validators : ...Address Validators})>.
  //If a person were to enter in a physical address and it passed all the validations, but then they checked the Checkbox indicating that the event is actually going to be online and then accidentally submitting the event without adding in the URL, this would now hold incorrect data in the database and cause rendering problems.
  //For this reason it's important to clear out the value so that a new value must be entered and go through any validators that may have been conditionally passed in specifically for it.
  useEffect(() => {
    setState({type: "UPDATE_STATE", name, payload: {value: '', approved: optional }})
  }, [resetDependency])

  //This useEffect hook adjusts the size of the field of entry if the input is a textfield (doesn't work on normal type="text" inputs)
  useEffect(() => {
    if (textareaRef.current){
      textareaRef.current.style.height = "100px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [value]);

  useEffect(() => {
    defaultValue && setState({type: "UPDATE_STATE", name, payload: {value: defaultValue, approved: true}})
  }, [defaultValue])

  const timeout = useRef(null)

  function handleAfterEntry(e){
    clearTimeout(timeout.current)
    let target = e.target
    let input = target.value
    timeout.current = setTimeout(function() {
      afterEntry({input, target})
    }, 750);
  }

  function renderCharCounter(){
    let lineBreaks = value.match(/$/mg).length
    let trueLength = value.length
    if (type === "textarea"){
      trueLength = lineBreaks === 1 ? trueLength : (lineBreaks - 1) * 100 + value.length
    }
    return (
      <span className={`tc ${counterSpanClassNames} ${trueLength >= limit ? "input-limit" : ''}`}>
          {trueLength}
      </span>
    )
  }

  function handleOnChange(e){
    let text = e.target.value
    let result = Validators.runOnChangeValidators({value: text, name, validators: onChangeValidators})
    if (result.pass){
      setState({type: "UPDATE_STATE", name, payload: {value: text}})
    } else if (continuous){
      setState({type: "UPDATE_STATE", name, payload: {value: text, errors: result.errors}})
    }
  }

  async function afterEntry({input, target}){
    target.placeholder = placeholder
    if (input.trim().length > 0){
      let response = await Validators.runAfterEntryValidators({value, name, validators: afterEntryValidators})
      if (response.pass){
        setState({type: "UPDATE_STATE", name, payload: {value: response.changeValue ? response.changeValue : input, approved: true, errors: [] }})
      } else {
        setState({type: "UPDATE_STATE", name, payload: {value: '', approved: false, errors: response.errors}})
        target.placeholder = response.errors[0]
      }
    } else if (optional){
      setState({type: "UPDATE_STATE", name, payload: {approved: true, value: '', errors: []}})
    } else {
      setState({type: "UPDATE_STATE", name, payload: {approved: false, value: '', errors: ["NO INPUT"]}})
      target.placeholder = `PLEASE ENTER ${placeholder}`
    }
  }

  let containerGutterStyle = {
    display: 'grid',
    gridTemplateColumns: '95% 5%',
  }

  if (type === "textarea"){
    return(
      <div id={name + "-input-container"} className={divClassNames} style={counter ? containerGutterStyle : null}>
        <textarea
          disabled={disabled}
          ref={textareaRef}
          id={name+"-input"}
          className={inputClassNames + (errors.length > 0 ? " field-with-errors" : "")}
          type="text"
          name={name}
          alt={name + " input"}
          placeholder={placeholder}
          onChange={handleOnChange}
          onKeyUp={handleAfterEntry}
          value={value}
        />
        {(counter && renderCharCounter())}
      </div>
    )
  } else {
    return(
      <div id={name + "-input-container"} className={divClassNames} style={counter ? containerGutterStyle : null}>
        <input
          disabled={disabled}
          id={name+"-input"}
          className={inputClassNames + (errors.length > 0 ? " field-with-errors" : "")}
          type="text"
          name={name}
          alt={name + " input"}
          placeholder={placeholder}
          onChange={handleOnChange}
          onKeyUp={handleAfterEntry}
          value={value}
        />
        {(counter && renderCharCounter())}
      </div>
    )
  }
}

//FUTURE COMPONENT DEVELOPMENT
//1. The ability to turn off textarea resizing if you want
