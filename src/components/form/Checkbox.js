import React, { useContext, useEffect } from 'react'

import { FormStoreContext } from './FormStoreContext'

export default function Checkbox({name='checkbox', labelText='', labelClassNames='', checkboxClassNames='', defaultValue=false, required=false}){

  const {setState, state, useRegisterWithFormContext} = useContext(FormStoreContext)
  let value = state[name] ? state[name].value : defaultValue
  let approved = state[name] ? state[name].approved : !required

  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: !required})

  useEffect(() => {
    defaultValue && setState({type: "UPDATE_STATE", name, payload: {value: defaultValue, approved: true}})
  }, [defaultValue])

  function handleOnChange(){
    setState({type: "UPDATE_STATE", name, payload: {value: !value, approved: !required ? true : !approved}})
  }

  return (
    <label id={name + "-checkbox"} className={labelClassNames}>
      <input
        type="checkbox"
        checked={value}
        onChange={handleOnChange}
        className={labelClassNames}
      />
        <span className={checkboxClassNames}></span>
        <span>{labelText || name}</span>
    </label>
  )
}
