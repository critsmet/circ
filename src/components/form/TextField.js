import React, { useContext, useEffect, useMemo, useRef } from 'react'

import { FormStoreContext } from './FormStoreContext'

import { runOnChangeValidators, runAfterEntryValidators } from '../../helpers/validators'

import { useDependencyResetRef } from '../../hooks/useDependencyResetRef'

export default function TextField({ name='text', type="text", counter=false, limit=Infinity, placeholder='', onChangeValidators=[], afterEntryValidators=[], divClassNames='', inputClassNames='', counterSpanClassNames='', defaultValue='', continuous=false, resetDependencies=[], disabled=false}){

  const textareaRef = useRef(null)
  const {setState, state, useRegisterWithFormContext} = useContext(FormStoreContext)
  let value = state[name] ? state[name].value : defaultValue
  let errors = state[name] ? state[name].errors : []
  //highly recommend that default values some from previously approved inputs!
  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: defaultValue !== ''})
  console.log("VALUE", value, "DEFAULT", defaultValue);

  useDependencyResetRef({setState, dependencies: resetDependencies, name})

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
    let result = runOnChangeValidators({value: text, name, validators: onChangeValidators})
    if (result.pass){
      setState({type: "UPDATE_STATE", name, payload: {value: text}})
    } else if (continuous){
      setState({type: "UPDATE_STATE", name, payload: {value: text, errors: result.errors}})
    }
  }

  async function afterEntry({input, target}){
    if (input.trim().length > 0){
      let response = await runAfterEntryValidators({value, name, validators: afterEntryValidators})
      if (response.pass){
        setState({type: "UPDATE_STATE", name, payload: {value: response.changeValue ? response.changeValue : input, approved: true, errors: [] }})
      } else {
        setState({type: "UPDATE_STATE", name, payload: {value: '', approved: false, errors: response.errors}})
        target.placeholder = response.errors[0]
      }
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
