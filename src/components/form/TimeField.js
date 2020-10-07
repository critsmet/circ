import React, { useContext, useEffect } from 'react'

import { hourValidator, timeValidator } from '../../helpers/validators'

import { FormStoreContext } from './FormStoreContext'

let date = new Date()
let nextDay = new Date(date.getTime() + (24 * 60 * 60 * 1000));
let todayYear = date.getFullYear()
let todayMonth = date.getMonth() + 1 //JavaScript returns .getMonth() values 0-11
let todayDay = date.getDate()
let todayHours = date.getHours()

export default function TimeField({name='time', divClassNames='', labelText="Time", labelClassNames="", minDay=todayDay, minMonth=todayMonth, minYear=todayYear, maxDay=null, maxMonth=null, maxYear=null, selectedDay=todayDay, selectedMonth=todayMonth, selectedYear=todayYear, defaultHour=todayHours, defaultMinute=0}){

  const {setState, state, useRegisterWithFormContext} = useContext(FormStoreContext)
  let value = state[name] ? state[name].value : {hours: ((defaultHour === todayHours) && (todayHours === 23)) ? 0 : defaultHour, minutes: defaultMinute }
  let {hours, minutes} = value

  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: true})

  let validatorInfoObject= {selectedYear, minYear, selectedMonth, minMonth, selectedDay, minDay, maxYear, maxMonth, maxDay, selectedHour: hours, currentHour: todayHours}

  useEffect(() => {
      console.log("IN YEAR MONTH DAY USE EFFECT", selectedYear, minYear, selectedMonth, minMonth, selectedDay, minDay);
      let validMinMaxTime = validateMinMaxValue(hours)
      setState({type: 'UPDATE_STATE', name, payload: {value: validMinMaxTime}})
    }, [selectedYear, selectedMonth, selectedDay])

  function validateMinMaxValue(hrs){
    let hourIncrement = hrs
    console.log("BEFORE LOOP", hrs, selectedDay);
    while(!hourValidator({...validatorInfoObject, selectedDay: ((hours === todayHours) && (todayHours === 23)) ? nextDay.getDate() : selectedDay, selectedHour: hourIncrement}).pass){
      console.log("IN LOOP", hrs, selectedDay);
      hourIncrement = hourIncrement === 23 ? 0 : hourIncrement + 1
    }
    return {hours: hourIncrement, minutes: 0}
  }

  function handleOnChange(e){
    let changedValue = parseInt(e.target.value)
    let fieldName = e.target.name
    let results = timeValidator({hours, minutes, [fieldName]: changedValue})
    if (results.pass){
      setState({type: 'UPDATE_STATE', name, payload: {value: {...value, [fieldName]: changedValue}, approved: true}})
    }
  }

  return (
    <div className={divClassNames} id={name + "-time"}>
      <select name="hours" value={hours} onChange={handleOnChange}>
        {Array.from(Array(24).keys()).map(num => <option key={num+"-hour-option"}{ ...!hourValidator({...validatorInfoObject, selectedHour: num}).pass && {disabled: true} } value={num}>{num < 10 ? "0" + num : num}</option>)}
      </select>
      <select name="minutes" value={minutes} onChange={handleOnChange}>
        <option value="00">00</option>
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="45">45</option>
        <option value="59">59</option>
      </select>
    </div>
  )
}

//FUTURE COMPONENT DEVELOPMENT
//1. Accept an argument called something like 'minMaxTimes' or 'schedule' that can receive an object with keys of days of the week and values of arrays of hours
//  EX: {monday: [8, 9, 10 , 11, 12, 13, 14, 15, 16], tuesday: [8, 9, 10, 11, 12, 13, 14, 15, 16], ...etc} to specify which days should have what times able to be selected
//  Something even simpler before that can just be a minMax hour that wouldn't even show the times outside of it .
