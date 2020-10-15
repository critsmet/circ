import React, { useContext, useEffect } from 'react'

import { FormContext } from './Form'

export default function CheckboxCollection({name='checkbox-collection', containerLabelText="", containerLabelClassNames='', divClassNames='', collection=[], defaultValue=[], labelClassNames='', checkboxClassNames='', counter=false, counterSpanClassNames='', limit=Infinity, required=true}){

  const {setState, state, useRegisterWithFormContext} = useContext(FormContext)
  let value = state[name] ? state[name].value : []

  useRegisterWithFormContext({defaultValue: [], name, defaultApproval: !required})

  useEffect(() => {
    defaultValue.length > 0 && setState({type: "UPDATE_STATE", name, payload: {value: defaultValue, approved: true}})
  }, [defaultValue.length])

  let ids = collection.map(item => item.id)

  function makeCheckboxes(){
    return collection.map(item => {
      return (
        <label key={item.name.split(" ").join("-") + "-checkbox-collection-option"} id={name + "-checkbox-collection-option"} className={labelClassNames}>
          <input
            type="checkbox"
            value={item.id}
            checked={value.includes(item.id)}
            onChange={handleOnChange}
            className={labelClassNames}
          />
            <span className={checkboxClassNames}></span>
            <span>{item.name}</span>
        </label>
      )
    })
  }

  function renderCheckboxCounter(){
    return (
      <span className={`tc ${counterSpanClassNames} ${value.length === limit ? "input-limit" : ''}`}>
          {value.length}
      </span>
    )
  }

  function handleOnChange(e){
    let clickedCheckbox = parseInt(e.target.value)
    if (ids.includes(clickedCheckbox)) {
      if (!value.includes(clickedCheckbox) && value.length !== limit){
        let newValue = [...value, clickedCheckbox]
        setState({type: 'UPDATE_STATE', name, payload: {value: newValue, approved: true}})
      } else {
        let newValue = value.filter(num => num !== clickedCheckbox)
        setState({type: 'UPDATE_STATE', name, payload: {value: newValue, approved: required && newValue.length === 0 ? false : true }})
      }
    }
  }

  let wrapperGutterStyle = {
    display: 'grid',
    gridTemplateColumns: '95% 5%',
  }

  return (
    <div id={name+"checkbox-collection-container"}>
      {containerLabelText ? <label className={containerLabelClassNames}>{containerLabelText}</label> : null}
      <div id={name+"checkbox-collection-wrapper"} style={counter ? wrapperGutterStyle : null}>
        <div className={divClassNames} id={name + "-checkbox-collection"}>
          {makeCheckboxes()}
        </div>
        {(counter && renderCheckboxCounter())}
      </div>
    </div>
  )
}
