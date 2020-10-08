import React from 'react'

import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Form } from "../form/FormStoreContext"

import TextField from '../form/TextField'

import { addressValidator } from '../../helpers/validators'

let date = new Date()
let todayYear = date.getFullYear()
let todayMonth = date.getMonth() + 1 //JavaScript returns .getMonth() values 0-11
let todayDay = date.getDate()

function LocationInput(){

  const history = useHistory()
  const dispatch = useDispatch()

  function handleSubmit(e, state){
    e.preventDefault()
    history.push(`/events?location=${state.location.value.replace(" ", "+")}&date=${todayYear}+${todayMonth}+${todayDay}&category=all`)
  }

  function handleClickViewOnline(){
    history.push(`/events?location=online&date=${todayYear}+${todayMonth}+${todayDay}&category=all`)
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
            <div className="hover-pointer" onClick={handleClickViewOnline}><u>or view online events</u></div>
            </div>
          </div>
        )
      }}
    />
  </div>
  )
}

export default LocationInput
