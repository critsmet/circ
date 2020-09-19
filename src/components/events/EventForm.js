import React, { useState, useEffect } from 'react'

import { useHistory } from 'react-router-dom';

import { BASE } from '../../index.js'

import { Form } from '../form/FormStoreContext'
import TextField from '../form/TextField'
import Checkbox from '../form/Checkbox'
import CheckboxCollection from '../form/CheckboxCollection'
import DateField from '../form/DateField'
import TimeField from '../form/TimeField'
import TagField from '../form/TagField'

import {createInvalidStringValidator, createArrayLimit, emailValidator, createLengthValidator, linkValidator, safeLinkValidator, addressValidator} from '../../helpers/validators'

const nameAndEmailOnChangeValidators = [createInvalidStringValidator(['/>', '</']), createLengthValidator(70)]

export default function EventForm({eventToBeEdited, setEvent}){

  const [fetchedCategories, setCategories] = useState([])

  const history = useHistory()

  useEffect(() => {
    fetch(BASE + "/categories")
      .then(res => res.json())
      .then(categoriesArray => setCategories(categoriesArray.sort((a, b) => a.name.length < b.name.length ? -1 : 1)))
  }, [])

  let editEventObj

  if (eventToBeEdited && eventToBeEdited.data){
    let {data: {id, attributes: {name, approved, needs_review, date, description, online, address, tags, categories, creator_email}}} = eventToBeEdited

    editEventObj = {
      id,
      name,
      date,
      description,
      online,
      address,
      tags,
      categories,
      creator_email,
      approved,
      needs_review
    }
  }

  function determineStatusMessage(){
    if (editEventObj.approved && !editEventObj.needs_review){
      return "This event has been approved and published"
    } else if (editEventObj.approved && editEventObj.needs_review){
      return "This event has been published but recent changes will be reviewed"
    } else if (!editEventObj.approved && editEventObj.needs_review){
      return "This event still needs to be approved by moderators"
    } else if (!editEventObj.aproved && !editEventObj.needs_review){
      return "This event was rejected, try making changes and submitting again"
    }
  }

  function handleSubmit(e, state){
    e.preventDefault()

    let newEventObj = {
      name: state.name.value,
      date: `${state.date.value.day}-${state.date.value.month}-${state.date.value.year} ${state.time.value.hours}:${state.time.value.minutes} ${/\((.*)\)/.exec(new Date().toString())[1]}`,
      description: state.description.value,
      online: state.online.value,
      address: state.address.value,
      tag_names: state.tags.value,
      creator_email: state.email.value,
      category_ids: state.categories.value
    }

    fetch(BASE + (editEventObj ? `/events/${editEventObj.id}` : "/events"), {
      method: editEventObj ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({event: newEventObj})
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      if (res.status === 201 || res.status === 202){
        if (res.response === "E-mail already confirmed"){
          history.push("/messages/submitted-event/approved")
        } else if (res.response === "E-mail confirmation required"){
          history.push("/messages/submitted-event/email-confirmation-required")
        } else if (res.response === "Changes saved"){
          setEvent(res.event)
          history.push(`/events/${editEventObj.id}`)
        }
      } else {
        history.push("/messages/submitted-event/denied")
      }
    })
    .catch(console.log)
  }

  return(
    <Form render={state => {
      console.log(editEventObj ? new Date(editEventObj.date).getDate() : undefined);
      return (
        <form className="w-100 mt1">
        <div>
          {editEventObj && <div className={"banner"}>{determineStatusMessage().toUpperCase()}</div>}
          <TextField
            name="name"
            defaultValue={editEventObj ? editEventObj.name : undefined}
            limit={70}
            counter={true}
            placeholder="EVENT NAME"
            counterSpanClassNames="f1-5"
            inputClassNames="w-100"
            onChangeValidators={nameAndEmailOnChangeValidators}
            divClassNames="mt1 w-100"
          />
          </div>
          <div className="gutter">
            <div className="flex-row flex-wrap space-between">
              <div className="mr1 ilb mw275 mt1">
                <label>DAY</label>
                <DateField
                  defaultDay={editEventObj ? new Date(editEventObj.date).getDate() : undefined}
                  defaultMonth={editEventObj ? new Date(editEventObj.date).getMonth() + 1 : undefined}
                  defaultYear={editEventObj ? new Date(editEventObj.date).getFullYear() : undefined}
                  maxYear={2021}
                  maxMonth={12}
                  maxDay={31}
                  divClassNames="ml1 ilb"
                />
              </div>
              <div className="ilb mt1">
                <label>TIME</label>
                <TimeField
                  selectedMonth={(state.date ? state.date.value.month : undefined) || (editEventObj ? new Date(editEventObj.date).getMonth() + 1 : undefined) }
                  selectedDay={(state.date ? state.date.value.day : undefined) || (editEventObj ? new Date(editEventObj.date).getDate() : undefined)}
                  selectedYear={(state.date ? state.date.value.year : undefined) || (editEventObj ? new Date(editEventObj.date).getFullYear() : undefined)}
                  defaultHour={editEventObj ? new Date(editEventObj.date).getHours() : undefined}
                  defaultMinute={editEventObj ? new Date(editEventObj.date).getMinutes() : undefined}
                  maxYear={2021}
                  maxMonth={12}
                  maxDay={31}
                  divClassNames="ml1 ilb "
                />
              </div>
              <Checkbox
                defaultValue={editEventObj ? editEventObj.online : undefined}
                labelText="ONLINE EVENT"
                name="online"
                labelClassNames="checkbox-label mr1 mt1 mw17"
                checkboxClassNames="checkbox-custom"
              />
            </div>
          </div>
          <div className="gutter">
            <div className="flex-row flex-wrap">
              <TextField
                name="address"
                defaultValue={editEventObj ? editEventObj.address : undefined}
                placeholder={state.online && state.online.value ? "EVENT LINK" : "ADDRESS"}
                divClassNames="grow-1 mt1 mw300"
                inputClassNames="w-100"
                resetDependencies={state.online ?[state.online.value] : []}
                onChangeValidators={[createInvalidStringValidator(['/>', '</'])]}
                afterEntryValidators={state.online && state.online.value ? [linkValidator, safeLinkValidator] : [addressValidator] }
              />
            </div>
          </div>
          <TextField
            type="textarea"
            name="description"
            defaultValue={editEventObj ? editEventObj.description : undefined}
            placeholder="DESCRIPTION"
            counter={true}
            limit={1500}
            inputClassNames="w-100"
            divClassNames="grow-1 mt1 mw300"
            counterSpanClassNames="f1-5"
            onChangeValidators={[createLengthValidator(1500)]}
          />
          <div className="mt1">
            <CheckboxCollection
              defaultValue={editEventObj ? editEventObj.categories.map(cat => cat.id) : undefined}
              counter={true}
              limit={2}
              name="categories"
              labelText="CATEGORIES"
              divClassNames="f1-3 flex-row flex-wrap pb-5 muted-form-bg w-100"
              labelClassNames="checkbox-label mt-5 grow-1 mw150"
              checkboxClassNames="checkbox-custom"
              collection={fetchedCategories}
              counterSpanClassNames="f1-5"
              onChangeValidators={[createArrayLimit(5)]}
            />
          </div>
          <TagField
            defaultValue={editEventObj ? editEventObj.tags.map(tag => tag.name) : undefined}
            divClassNames="scroll mt1 flex-row align-center no-wrap w-100 muted-form-bg"
            inputClassNames="grow-1 transp-bg"
            collectionClassNames="ilb pl-5"
            tagClassNames="tag"
            counter={true}
            limit={3}
            counterSpanClassNames="f1-5 mt1"
          />
          <div className="gutter">
            <div className="flex-row flex-wrap space-between align-center">
              <div className="ilb mt1 f1-5">REVIEW COMMUNITY GUIDELINES ↓</div>
              <Checkbox
                labelText="I ACCEPT THE GUIDELINES"
                name="guidelines"
                labelClassNames="checkbox-label mt1"
                checkboxClassNames="checkbox-custom"
                required={true}
              />
            </div>
          </div>
          <div className="gutter">
            <div className="flex-row flex-wrap space-between">
              <TextField
                name="email"
                defaultValue={editEventObj ? editEventObj.creator_email : undefined}
                counter={false}
                limit={320}
                inputClassNames="w-100"
                placeholder="E-MAIL"
                counterSpanClassNames="f1-5"
                divClassNames="mt1 w-75 ilb"
                afterEntryValidators={[emailValidator]}
              />
              <input
                type="submit"
                value={editEventObj ? "EDIT" : "SUBMIT"}
                onClick={(e) => handleSubmit(e, state)}
                disabled={Object.values(state).find(obj => obj.errors.length > 0) || Object.values(state).find(obj => obj.approved === false)}
              />
            </div>
          </div>
        </form>
      )
    }}>
    </Form>
  )
}
