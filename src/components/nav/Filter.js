import React, { useEffect, useState } from 'react'

import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import { addressValidator } from '../../helpers/validators'

import { BASE } from '../../index.js'

import { Form } from '../form/FormStoreContext'
import Checkbox from '../form/Checkbox'
import TextField from '../form/TextField'
import DateField from '../form/DateField'
import Dropdown from '../form/Dropdown'

export default function Filter({ setShowFilter }){

  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const searchParams = useSelector(state => state.searchParams)
  const categories = useSelector(state => state.categories)
  const paramsObj = queryString.parse(searchParams)

  return (
    <div id="nav-filter">
      <Form render={(state) => {

        function handleSubmit(e){
          e.preventDefault()
          setShowFilter(false)
          let paramsArray = ['/events?']
          console.log(state.location);
          if (state.online.value){
            paramsArray = paramsArray.concat(`location=online`)
          } else if (state.location.value !== ""){
            paramsArray = paramsArray.concat(`location=${state.location.value.replace(/\s/g, '+')}`)
          }
          paramsArray = paramsArray.concat(`date=${state.date.value.year}+${state.date.value.month}+${state.date.value.day}`)
          paramsArray = paramsArray.concat(`category=${state.category.value === -1 ? "all" : categories.find(cat => cat.id === state.category.value).name.replace(/\s/g, '+')}`)
          let firstTwoInParamsString = paramsArray.shift() + paramsArray.shift()
          let paramsString = [firstTwoInParamsString, ...paramsArray].join("&")
          history.push(paramsString)
        }

        function shouldBeDisabled(){
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

        return (
          <form onSubmit={handleSubmit}>
            <div className={"flex-row flex-wrap w-100 space-between align-center"}>
              <Checkbox
                defaultValue={paramsObj.location ? paramsObj.location === "online" : undefined}
                labelText="ONLINE EVENTS"
                name="online"
                labelClassNames="checkbox-label mr1 mw17"
                checkboxClassNames="checkbox-custom"
                optional={true}
              />
              <div className="mr1 ilb mw275">
                <label>DAY</label>
                <DateField
                  minYear={2020}
                  minMonth={1}
                  minDay={1}
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
                defaultValue={paramsObj.category && categories.map(category => category.name).includes(paramsObj.category) ? categories.find(cat => cat.name === paramsObj.category).id : -1}
                name={"category"}
                selectClassNames=""
                placeholder={"SELECT A CATEGORY"}
                collection={[{id: -1, name: "all categories"}, ...categories]}
              />
            </div>
            <div className={"flex-row flex-wrap space-between align-center"}>
              <TextField
                optional={true}
                name="location"
                defaultValue={paramsObj.location && paramsObj.location !== "online" ? paramsObj.location : undefined}
                placeholder={(state.online && state.online.value) ? "SEARCHING ONLINE EVENTS" : "ADDRESS" }
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
