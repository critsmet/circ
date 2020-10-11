import React, { useContext, useEffect } from 'react'

import Validators from '../../helpers/validators'

import { FormStoreContext } from './Form'

const today = new Date()
const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
const todayYear = today.getFullYear()
const todayMonth = today.getMonth() + 1 //JavaScript returns .getMonth() values 0-11
const todayDay = today.getDate()
const todayHours = today.getHours()

export default function TimeField({name='time', divClassNames='', labelText="Time", labelClassNames="", minDay=todayDay, minMonth=todayMonth, minYear=todayYear, maxDay=null, maxMonth=null, maxYear=null, selectedDay=todayDay, selectedMonth=todayMonth, selectedYear=todayYear, defaultHour=todayHours, defaultMinute=0}){

  const {setState, state, useRegisterWithFormContext} = useContext(FormStoreContext)
  let value = state[name] ? state[name].value : {hours: ((defaultHour === todayHours) && (todayHours === 23)) ? 0 : defaultHour, minutes: defaultMinute }
  let {hours, minutes} = value

  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: true})

  //The TimeField component uses a validator that takes in the following information and determines if, given these parameters plus the hour in question (which is determined when the object is used below), if the hour should be selectable
  let validatorInfoObject= {selectedYear, minYear, selectedMonth, minMonth, selectedDay, minDay, maxYear, maxMonth, maxDay, selectedHour: hours, currentHour: todayHours}

  //This function makes sure that, if there's a minimum time that can be selected, the option is always one hour ahead.
  //It will also take in the minimum day, if given, and if the minimum day is now tomorrow because it's 11PM, it will make sure that the Hour select starts at midnight. 
  function validateMinMaxValue(hrs){
    let hourIncrement = hrs
    while(!Validators.hourValidator({...validatorInfoObject, selectedDay: ((hours === 0) && (todayHours === 23)) ? tomorrow.getDate() : selectedDay, selectedHour: hourIncrement}).pass){
      hourIncrement = hourIncrement === 23 ? 0 : hourIncrement + 1
    }
    return {hours: hourIncrement, minutes: 0}
  }

  useEffect(() => {
    let validMinMaxTime = validateMinMaxValue(hours)
    setState({type: 'UPDATE_STATE', name, payload: {value: validMinMaxTime}})
  }, [selectedYear, selectedMonth, selectedDay])


  function handleOnChange(e){
    let changedValue = parseInt(e.target.value)
    let fieldName = e.target.name
    let results = Validators.timeValidator({hours, minutes, [fieldName]: changedValue})
    if (results.pass){
      setState({type: 'UPDATE_STATE', name, payload: {value: {...value, [fieldName]: changedValue}, approved: true}})
    }
  }

  return (
    <div className={divClassNames} id={name + "-time"}>
      <select name="hours" value={hours} onChange={handleOnChange}>
        {Array.from(Array(24).keys()).map(num => <option key={num+"-hour-option"}{ ...!Validators.hourValidator({...validatorInfoObject, selectedHour: num}).pass && {disabled: true} } value={num}>{num < 10 ? "0" + num : num}</option>)}
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
