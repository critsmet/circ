import React, { useContext, useEffect } from 'react'

import { FormStoreContext } from './Form'

export default function Dropdown({name='dropdown', placeholder="Select", divClassNames='', collection=[], defaultValue=0, selectClassNames=''}){

  const {setState, state, useRegisterWithFormContext} = useContext(FormStoreContext)
  let value = state[name] ? state[name].value : 0

  useRegisterWithFormContext({defaultValue: 0, name, defaultApproval: false})

  useEffect(() => {
    defaultValue !== 0 && setState({type: "UPDATE_STATE", name, payload: {value: defaultValue, approved: true}})
  }, [defaultValue])

  let ids = collection.map(item => item.id)

  function makeOptions(){
    return collection.map(item => {
      return (
        <option key={item.name.split(" ").join("-") + "-dropdown-collection-option"} id={name + "-dropdown-collection-option"} value={item.id}>{item.name}</option>
      )
    })
  }

  function handleOnChange(e){
    let selectedOption = parseInt(e.target.value)
    if (ids.includes(selectedOption)) {
      setState({type: 'UPDATE_STATE', name, payload: {value: selectedOption, approved: true}})
    }
  }

  return (
    <div id={name+"checkbox-collection-container"}>
      <select value={value} className={selectClassNames} onChange={handleOnChange}>
        <option value={0} disabled>{placeholder}</option>
        {makeOptions()}
      </select>
    </div>
  )
}
