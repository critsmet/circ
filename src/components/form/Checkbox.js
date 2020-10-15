import React, { useContext, useEffect } from 'react'

import { FormContext } from './Form'

export default function Checkbox({name='checkbox', labelText=null, labelClassNames='', checkboxClassNames='', defaultValue=false, required=true}){

  const {setState, state, useRegisterWithFormContext} = useContext(FormContext)
  let value = state[name] ? state[name].value : defaultValue

  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: !required})

  useEffect(() => {
    setState({type: "UPDATE_STATE", name, payload: {value: defaultValue, approved: required ? defaultValue : true}})
  }, [defaultValue])

  function handleOnChange(){
    setState({type: "UPDATE_STATE", name, payload: {value: !value, approved: required ? defaultValue : true}})
  }

  return (
    <label id={name + "-checkbox"} className={labelClassNames}>
      <input
        type="checkbox"
        checked={value}
        onChange={handleOnChange}
      />
        <span className={checkboxClassNames}></span>
        <span>{labelText || name}</span>
    </label>
  )
}
