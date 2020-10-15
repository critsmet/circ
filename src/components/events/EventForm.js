import React from 'react'

import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux'

import { BASE } from '../../index.js'

import { Form } from '../form/Form'
import TextField from '../form/TextField'
import Checkbox from '../form/Checkbox'
import CheckboxCollection from '../form/CheckboxCollection'
import DateField from '../form/DateField'
import TimeField from '../form/TimeField'
import TagField from '../form/TagField'

import Validators from '../../helpers/validators'

export default function EventForm({eventToBeEdited, setEvent}){

  const history = useHistory()
  const categories = useSelector(state => state.categories)

  //This component is meant to be used for both creating and editing an event, so an eventToBeEdited argument may be passed in and the values of the event will be used as default values in the form via this editEventObj
  let editEventObj
  if (eventToBeEdited && eventToBeEdited.data){
    let {data: {id, attributes}} = eventToBeEdited
    editEventObj = {id, ...attributes}
  }

  //These messages are displayed at the top of the form if an event is being edited
  function determineStatusMessage(){
    if (editEventObj.approved && !editEventObj.needs_review){
      return "This event has been approved and published"
    } else if (editEventObj.approved && editEventObj.needs_review){
      return "This event is published but will be reviewed again"
    } else if (!editEventObj.approved && editEventObj.needs_review){
      return "This event still needs to be approved by moderators"
    } else if (!editEventObj.aproved && !editEventObj.needs_review){
      return "This event was rejected, make changes and submit again"
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
      category_ids: state.categories.value,
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
    .catch((error) => {
      console.log(error);
      alert("There was an error submitting, please try again. If this error continues, email us at contact@circular.events")
    })
  }

  return(
    //This component is being composed using a "smart" Form component found in ../form/Form. All of the input fields are reusable custom components. View the README or comments in each component's file to learn how to use.
    <Form render={state => {

      function renderAddressForTimeZoneInput(){
        return(
          <div className="gutter">
            <div className="flex-row flex-wrap">
              <TextField
                name="timezone-address"
                defaultValue={editEventObj ? editEventObj.address : undefined}
                placeholder={"ADDRESS FOR TIME ZONE"}
                divClassNames="grow-1 mt1 mw300"
                inputClassNames="w-100"
                onChangeValidators={[Validators.createInvalidStringValidator(['/>', '</'])]}
                afterEntryValidators={[Validators.addressValidator]}
              />
            </div>
          </div>
        )
      }

      return (
        <form className="w-100 mt1" onSubmit={(e) => handleSubmit(e, state)}>
        <div>
          {editEventObj && <div className={"tc green-bg f-blue f1-75 mt-5 mb-5"}>{determineStatusMessage().toUpperCase()}</div>}
          <TextField
            name="name"
            defaultValue={editEventObj ? editEventObj.name : undefined}
            limit={70}
            counter={true}
            placeholder="EVENT NAME"
            counterSpanClassNames="f1-5"
            inputClassNames="w-100"
            onChangeValidators={[Validators.createInvalidStringValidator(['/>', '</']), Validators.createLengthValidator(70)]}
            divClassNames="mt1 w-100"
          />
          </div>
          <div className="gutter">
            <div className="flex-row flex-wrap space-between">
              <div className="mr1 ilb mw275 mt1">
                <label>DATE</label>
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
                required={false}
                defaultValue={editEventObj ? editEventObj.online : undefined}
                containerLabelText="ONLINE EVENT"
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
                  resetDependency={state.online ? state.online.value : false}
                  onChangeValidators={[Validators.createInvalidStringValidator(['/>', '</'])]}
                  afterEntryValidators={state.online && state.online.value ? [Validators.linkValidator, Validators.safeLinkValidator] : [Validators.addressValidator] }
                />
              </div>
            </div>
          {state.online && state.online.value ? renderAddressForTimeZoneInput() : null}
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
            onChangeValidators={[Validators.createLengthValidator(1500)]}
          />
          <div className="mt1">
            <CheckboxCollection
              defaultValue={editEventObj ? editEventObj.categories.map(cat => cat.id) : undefined}
              counter={true}
              limit={2}
              name="categories"
              labelText="CATEGORIES"
              divClassNames="f1-3 flex-row flex-wrap pb-5 muted-green-bg w-100"
              labelClassNames="checkbox-label mt-5 grow-1 mw150"
              checkboxClassNames="checkbox-custom"
              collection={categories}
              counterSpanClassNames="f1-5"
              onChangeValidators={[Validators.createArrayLimit(5)]}
            />
          </div>
          <div className="gutter">
            <div className="flex-row flex-wrap space-between align-center">
              <div className="ilb mt1 f1-5">REVIEW COMMUNITY GUIDELINES ↓</div>
              <Checkbox
                containerLabelText="I ACCEPT THE GUIDELINES"
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
                afterEntryValidators={[Validators.emailValidator]}
              />
              <input
                type="submit"
                value={editEventObj ? "EDIT" : "SUBMIT"}
                disabled={Object.values(state).find(obj => obj.errors.length > 0) || Object.values(state).find(obj => obj.approved === false)}
              />
            </div>
          </div>
        </form>
      )
    }}/>
  )
}

//Haven't quite integrated tags the way I'd like to yet but have the code written out for it
// <TagField
//   placeholder="TAGS"
//   required={false}
//   defaultValue={editEventObj ? editEventObj.tags.map(tag => tag.name) : undefined}
//   divClassNames="scroll mt1 flex-row align-center no-wrap w-100 muted-green-bg"
//   inputClassNames="grow-1 transp-bg"
//   collectionClassNames="ilb pl-5"
//   tagClassNames="tag"
//   counter={true}
//   limit={3}
//   counterSpanClassNames="f1-5 mt1"
// />
