import React from 'react'

import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Form } from "../form/Form"
import Filter from '../nav/Filter'

import TextField from '../form/TextField'

import { addressValidator } from '../../helpers/validators'

let date = new Date()
let todayYear = date.getFullYear()
let todayMonth = date.getMonth() + 1 //JavaScript returns .getMonth() values 0-11
let todayDay = date.getDate()

function LocationInput(){

  const dispatch = useDispatch()
  const history = useHistory()

  function handleSubmit(e, state){
    e.preventDefault()
    history.push(`/events?location=${state.location.value.replace(/\s/g, '+')}&date=${todayYear}+${todayMonth}+${todayDay}&category=all`)
  }

  function handleClickViewOnline(){
    history.push(`/events?location=online&date=${todayYear}+${todayMonth}+${todayDay}&category=all`)
  }

  return (
    <div id="location-form">
      <Filter />
  </div>
  )
}

export default LocationInput
