import React from 'react'

import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'

import  Validators  from '../../helpers/validators'

import { Form } from '../form/Form'
import Checkbox from '../form/Checkbox'
import TextField from '../form/TextField'
import DateField from '../form/DateField'
import Dropdown from '../form/Dropdown'

export default function Filter({ submitFunctions=[] }){

  const history = useHistory()
  const location = useLocation()
  const categories = useSelector(state => state.categories)
  const urlSearchParams = new URLSearchParams(location.search);

  return (
    <div id="nav-filter">
      <Form render={(state) => {

        function handleSubmit(e){
          e.preventDefault()
          submitFunctions.forEach(func => func())
          if (state.online.value){
            urlSearchParams.set("location", "online")
          } else if (state.location.value !== ""){
            urlSearchParams.set("location", state.location.value)
          }
          urlSearchParams.set("date", `${state.date.value.year} ${state.date.value.month} ${state.date.value.day}`)
          urlSearchParams.set("category", state.category.value === -1 ? "all" : categories.find(cat => cat.id === state.category.value).name.replace(/\s/g, '+'))
          history.push(`/events?${urlSearchParams}`)
        }

        //If the Checkbox indicicating that the visitor wants to visit online events is checked, then the value for the "Location" input is unnecessary, so this function removes it in that case
        //In either case it will check all inputs for errors and will only allow the button to be enabled if there are no errors and all are approved.
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
            <div className={"flex-row flex-wrap w-100 space-between align-center mt1"}>
              <Checkbox
                defaultValue={urlSearchParams.get("location") ? urlSearchParams.get("location") === "online" : undefined}
                labelText="ONLINE EVENTS"
                name="online"
                labelClassNames="checkbox-label mr1 mw17"
                checkboxClassNames="checkbox-custom"
                optional={true}
              />
              <div className="mr1 ilb mw275">
                <label>DATE</label>
                <DateField
                  minYear={2020}
                  minMonth={1}
                  minDay={1}
                  defaultDay={urlSearchParams.get("date") ? parseInt(urlSearchParams.get("date").split(" ")[2]) : undefined}
                  defaultMonth={urlSearchParams.get("date") ? parseInt(urlSearchParams.get("date").split(" ")[1]) : undefined}
                  defaultYear={urlSearchParams.get("date") ? parseInt(urlSearchParams.get("date").split(" ")[0]) : undefined}
                  maxYear={2021}
                  maxMonth={12}
                  maxDay={31}
                  divClassNames="ml1 ilb"
                />
              </div>
              <Dropdown
                defaultValue={urlSearchParams.get("category") && categories.map(category => category.name).includes(urlSearchParams.get("category")) ? categories.find(cat => cat.name === urlSearchParams.get("category")).id : -1}
                name={"category"}
                selectClassNames=""
                placeholder={"SELECT A CATEGORY"}
                collection={[{id: -1, name: "all categories"}, ...categories]}
              />
            </div>
            <div className={"flex-row flex-wrap space-between align-center mt1"}>
              <TextField
                optional={true}
                name="location"
                defaultValue={urlSearchParams.get("location") && urlSearchParams.get("location") !== "online" ? urlSearchParams.get("location") : undefined}
                placeholder={(state.online && state.online.value) ? "SEARCHING ONLINE EVENTS" : "ADDRESS" }
                divClassNames="w-70 ilb"
                inputClassNames="w-100"
                afterEntryValidators={[Validators.addressValidator]}
                disabled={state.online && state.online.value}
              />
              <input
                type="submit"
                value={"SEARCH EVENTS"}
                className="w-25 h2"
                disabled={shouldBeDisabled()}
              />
            </div>
          </form>
        )
      }}/>
    </div>
  )
}
