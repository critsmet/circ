import React from 'react'

import { useHistory, Link } from 'react-router-dom'

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
    <div>
      <Form render={state => {
        return (
          <div id="location-form" className="w-100 tc">
            <TextField
              name="location"
              placeholder={"STREET ADDRESS, CITY, COUNTRY"}
              divClassNames="mt1 w-100"
              inputClassNames="w-40 mw325 tc"
              afterEntryValidators={[addressValidator]}
            />
            <br/>
            <div className="h2">
            <input
              type="submit"
              onClick={(e) => handleSubmit(e, state)}
              value={"SEARCH EVENTS"}
              disabled={Object.values(state).find(obj => obj.errors.length > 0) || Object.values(state).find(obj => obj.approved === false)}
            />
            <br/>
            <br/>
            <Link to="/events?location=online">or view online events</Link>
            </div>
          </div>
        )
      }}
    />
  </div>
  )
}

export default LocationInput
