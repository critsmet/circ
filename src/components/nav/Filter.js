import React, { useEffect, useState } from 'react'

import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'

import { addressValidator } from '../../helpers/validators'

import { BASE } from '../../index.js'

import { Form } from '../form/FormStoreContext'
import Checkbox from '../form/Checkbox'
import TextField from '../form/TextField'
import DateField from '../form/DateField'
import Dropdown from '../form/Dropdown'

export default function Filter({ showFilter, setShowFilter }){

  const history = useHistory()
  const location = useLocation()
  const searchParams = useSelector(state => state.searchParams)
  const categories = useSelector(state => state.categories)
  const paramsObj = queryString.parse(location.search)

  return (
    <div id="nav-filter">
      <Form render={(state) => {

        function handleSubmit(e){
          e.preventDefault()
          setShowFilter(!showFilter)
          history.push(`/events?location=${state.online.value ? "online" : state.location.value.replace(", ", "+")}&date=${state.date.value.year}+${state.date.value.month}+${state.date.value.day}&category=${state.category.value}`)
        }


        function shouldBeDisabled(){
          console.log(state);
          if (state.online && state.online.value){
            let stateCopy = {...state}
            delete stateCopy.location
            return Object.values(stateCopy).find(obj => obj.errors.length > 0) || Object.values(stateCopy).find(obj => obj.approved === false)
          } else if (Object.values(state)){
            return Object.values(state).find(obj => obj.errors.length > 0) || Object.values(state).find(obj => obj.approved === false)
          } else {
            return false
          }
        }

        console.log(paramsObj);

        return (
          <form onSubmit={handleSubmit}>
            <div className={"flex-row flex-wrap w-100 space-between align-center"}>
              <Checkbox
                defaultValue={paramsObj.location ? paramsObj.location === "online" : undefined}
                labelText="ONLINE EVENTS"
                name="online"
                labelClassNames="checkbox-label mr1 mt1 mw17"
                checkboxClassNames="checkbox-custom"
                optional={true}
              />
              <div className="mr1 ilb mw275">
                <label>DAY</label>
                <DateField
                  defaultDay={paramsObj.date ? parseInt(paramsObj.date.split(" ")[2]) : undefined}
                  defaultMonth={paramsObj.date ? parseInt(paramsObj.date.split(" ")[1]) : undefined}
                  defaultYear={paramsObj.date ? parseInt(paramsObj.date.split(" ")[0]) : undefined}
                  maxYear={2021}
                  maxMonth={12}
                  maxDay={31}
                  divClassNames="ml1 ilb"
                />
              </div>
              <Dropdown
                defaultValue={paramsObj.category && categories.map(category => category.id).includes(parseInt(paramsObj.category)) ? parseInt(paramsObj.category) : undefined}
                name={"category"}
                selectClassNames=""
                placeholder={"SELECT A CATEGORY"}
                collection={categories}
              />
            </div>
            <div className={"flex-row flex-wrap space-between align-center"}>
              <TextField
                name="location"
                defaultValue={paramsObj.location && paramsObj.location !== "online" ? paramsObj.location : undefined}
                placeholder={(state.online && state.online.value) ? "SEARCHING ONLINE EVENTS" : "LOCATION" }
                divClassNames="w-70 ilb"
                inputClassNames="w-100"
                afterEntryValidators={[addressValidator]}
                disabled={state.online && state.online.value}
              />
              <input
                type="submit"
                value={"SEARCH EVENTS"}
                className="w-25 mt1 h2"
                disabled={shouldBeDisabled()}
              />
            </div>
          </form>
        )
      }}/>
    </div>
  )
}
