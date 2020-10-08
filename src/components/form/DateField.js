import React, { useContext, useEffect } from 'react'

import { FormStoreContext } from './FormStoreContext'

import { dayValidator, monthValidator, dateReconfigurer } from '../../helpers/validators'

let today = new Date()
let todayYear = today.getFullYear()
let todayMonth = today.getMonth() + 1 //JavaScript returns .getMonth() values 0-11
let todayDay = today.getDate()
let todayHours = today.getHours()

export default function DateField({name='date', labelText="Day", labelClassNames="", defaultYear=todayYear, defaultMonth=todayMonth, defaultDay=todayDay, minYear=todayYear, minMonth=todayMonth, minDay=todayDay, maxYear=(todayYear + 1), maxMonth=12, maxDay=31, divClassNames=''}){

  const {setState, state, useRegisterWithFormContext} = useContext(FormStoreContext)

  //Important to have this useEffect above the if statement below that will change the day to the next day if today is the minimum day and it's 11PM
  useEffect(() => {
    setState({type: "UPDATE_STATE", name, payload: {value: {year: defaultYear, month: defaultMonth, day: defaultDay}, approved: true}})
  }, [defaultYear, defaultMonth, defaultDay])

  let defaultValue = {}
  //this function checks to see if the time is 23:00, in which case the default date displayed would have to be the next day if there's a minimum day
  if (todayHours === 23 && minDay === todayDay){
    let nextDay = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    let day = nextDay.getDate()
    let year = nextDay.getFullYear()
    let month = nextDay.getMonth() + 1
    defaultValue = {year, month, day}
  } else {
    defaultValue =  {year: defaultYear, month: defaultMonth, day: defaultDay}
  }

  let value = state[name] ? state[name].value : defaultValue
  let {month, day, year} = value

  let validatorInfoObject = {minYear, maxYear, selectedYear: year, minMonth, maxMonth, selectedMonth: month, minDay, maxDay, selectedDay: day, hours: todayHours}
  let disabledObj = {disabled: true}

  useRegisterWithFormContext({defaultValue: value, name, defaultApproval: true})

  function makeYearOptions(){
    let options = []
    let yearCounter = minYear
    while (yearCounter <= maxYear){
      options.push(<option key={yearCounter + "-year-option"}value={yearCounter}>{yearCounter}</option>)
      yearCounter++
    }
    return options
  }

  function handleOnChange(e){
    let changedValue = parseInt(e.target.value)
    let fieldName = e.target.name
    let newDate = dateReconfigurer({changedValue, fieldName, ...validatorInfoObject, setState})
    setState({type: 'UPDATE_STATE', name, payload: {value: newDate, approved: true}})
  }

  console.log(defaultDay, defaultYear, defaultMonth);

  return (
    <div className={divClassNames} id={name + "-date"}>
      <select onChange={handleOnChange} name="year" value={year}>
        {makeYearOptions()}
      </select>
      <select onChange={handleOnChange} name="month" value={month}>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 1}).pass && disabledObj } value={1}>JAN</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 2}).pass && disabledObj } value={2}>FEB</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 3}).pass && disabledObj } value={3}>MAR</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 4}).pass && disabledObj } value={4}>APR</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 5}).pass && disabledObj } value={5}>MAY</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 6}).pass && disabledObj } value={6}>JUN</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 7}).pass && disabledObj } value={7}>JUL</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 8}).pass && disabledObj } value={8}>AUG</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 9}).pass && disabledObj } value={9}>SEP</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 10}).pass && disabledObj } value={10}>OCT</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 11}).pass && disabledObj } value={11}>NOV</option>
        <option {...!monthValidator({...validatorInfoObject, monthInQuestion: 12}).pass && disabledObj } value={12}>DEC</option>
      </select>
      <select onChange={handleOnChange} name="day" value={day}>
        {Array.from(Array(31).keys()).map(num => <option key={num + "-day-option"} {...!dayValidator({...validatorInfoObject, dayInQuestion: num + 1}).pass  && disabledObj} value={num + 1}>{num + 1}</option>)}
      </select>
    </div>
  )
}

//FUTURE COMPONENT DEVELOPMENT
//1. Add maximum date values, this would force us to refactor the dateReconfigurer as well
