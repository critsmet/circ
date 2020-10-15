import React, { useContext, useEffect, useRef } from 'react'

import { FormContext } from './Form'

import Validators from '../../helpers/validators'

export default function TextField({ name='text', type="text", counter=false, limit=Infinity, placeholder='', onChangeValidators=[], afterEntryValidators=[], afterEntryValidatorsTimeout=750, divClassNames='', inputClassNames='', counterSpanClassNames='', defaultValue='', continuous=false, resetDependency=false, disabled=false, required=true}){

  const {setState, state, useRegisterWithFormContext} = useContext(FormContext)
  let value = state[name] ? state[name].value : defaultValue
  let errors = state[name] ? state[name].errors : []

  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: !required || defaultValue !== ''})

  //If the value of the required resetDependency prop changes, it will clear the value of the text field
  useEffect(() => {
    setState({type: "UPDATE_STATE", name, payload: {value: '', approved: !required }})
  }, [resetDependency])

  //The following useEffect needs to go below the one above because hooks run in order and the value of the reset dependency might change when a default value comes in for whatever that dependency represents
  //This would clear the value of the default text after it has been loaded
  useEffect(() => {
    defaultValue !== '' && setState({type: "UPDATE_STATE", name, payload: {value: defaultValue, approved: true}})
  }, [defaultValue])

  //This textareaRef is used by the useEffect hook to adjust the size of the field of entry if the input is a textfield (doesn't work on normal type="text" inputs)
  //ie if the text being inputted becomes "higher" than the textfield itself, the textfield will expand to adjust
  const textareaRef = useRef(null)
  useEffect(() => {
    if (textareaRef.current){
      textareaRef.current.style.height = "100px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [value]);

  function renderCharCounter(){
    //Remove line breaks from character count
    let lineBreaks = value.match(/$/mg).length
    let trueLength = value.length
    if (type === "textarea"){
      //Line breaks are worth 100 characters
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

  //This ref is used to store the id of the current setTimeout, which gets reset on every keyUp
  //After 3/4 of a second, the 'afterEntry' function runs the validators in the 'afterEntryValidators' array
  const timeout = useRef(null)

  function handleAfterEntry(e){
    clearTimeout(timeout.current)
    let target = e.target
    let input = target.value
    timeout.current = setTimeout(function() {
      afterEntry({input, target})
    }, afterEntryValidatorsTimeout);
  }

  //This is an aysnc function because the 'afterEntryValidators' usually make async requests
  async function afterEntry({input, target}){
    target.placeholder = placeholder
    //Makes sure that the validators don't run just for empty spaces
    if (input.trim().length > 0){
      let response = await Validators.runAfterEntryValidators({value, name, validators: afterEntryValidators})
      if (response.pass){
        //The response from the 'runAfterEntryValidators' method can return a value that it would like to reset the value to in state
        //One example would be for geocoding; if someone types in an address that's lacking data that the geocoding service can provide, that might be the better option to store in the state, rather than the incomplete value originally inputted
        setState({type: "UPDATE_STATE", name, payload: {value: response.changeValue ? response.changeValue : input, approved: true, errors: [] }})
      } else {
        //If the input does not pass all of the validators in the 'runAfterEntryValidators' array, the value is reset to an empty string and the placeholder value becomes the value of the first error
        setState({type: "UPDATE_STATE", name, payload: {value: '', approved: false, errors: response.errors}})
        target.placeholder = response.errors[0]
      }
    } else if (required === false){
      //If the input is not required, reset the value even if just a space is entered
      setState({type: "UPDATE_STATE", name, payload: {approved: true, value: '', errors: []}})
    } else {
      //If the input is required, reset the space value and show an error in the placeholder
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
          onBlur={handleAfterEntry}
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
          onBlur={handleAfterEntry}
          value={value}
        />
        {(counter && renderCharCounter())}
      </div>
    )
  }
}
