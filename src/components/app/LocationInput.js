import React from 'react'

import { useHistory } from 'react-router-dom'

import { Form } from "../form/FormStoreContext"

import TextField from '../form/TextField'

import { addressValidator } from '../../helpers/validators'

function LocationInput(){

  const history = useHistory()

  function handleSubmit(e, state){
    e.preventDefault()
    history.push(`/events?location=${state.location.value.replace(", ", "+")}`)

  }
  return (
      <Form render={state => {
        return (
          <div id="location-form" className="w-40">
            <TextField
              name="location"
              placeholder={"ENTER YOUR LOCATION"}
              divClassNames="grow-1 mt1 mw300"
              inputClassNames="w-100"
              afterEntryValidators={[addressValidator]}
            />
            <br/>
            <input
              type="submit"
              onClick={(e) => handleSubmit(e, state)}
              value={"SEARCH EVENTS"}
              disabled={Object.values(state).find(obj => obj.errors.length > 0) || Object.values(state).find(obj => obj.approved === false)}
            />
          </div>
        )
      }}
    />
  )
}

export default LocationInput
