import React, { useEffect, useState } from 'react'

import { Redirect } from 'react-router-dom'

import { BASE } from '../../index.js'

import Event from './Event'
import EventForm from './EventForm'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function EventShow({location, match}){

  //id: undefined, attributes: {name: undefined, date: undefined, description: undefined, online: undefined, address: undefined, categories: undefined, tags: undefined, creator_email: undefined}})

  const [selectedEvent, setEvent] = useState({})

  useEffect(() => {
    fetch(BASE + `/events/${match.params.id}`)
      .then(res => res.json())
      .then(setEvent)
  }, [])

  let formattedDate = selectedEvent.data ? new Date(selectedEvent.data.attributes.date).toString().split(" ").slice(0, 4) : ''
  typeof(formattedDate) === "object" && formattedDate.splice(0, 1, days[new Date(selectedEvent.data.attributes.date).getDay()])
  formattedDate = typeof(formattedDate) === "object" ? formattedDate.join(", ") : ''

  const urlParams = new URLSearchParams(location.search)
  const editToken = urlParams.get("edit_token")

  // useEffect(() => {
  //   if( selectedEvent.data && (new Date(selectedEvent.data.attributes.date) <= new Date()) && editToken){
  //     console.log(editToken);
  //     history.push("/messages/event/expired")
  //     return
  //   }
  // }, [selectedEvent])


  if (selectedEvent.data && selectedEvent.data.attributes.edit_token === editToken){
    if (new Date(selectedEvent.data.attributes.date) <= new Date()){
      return <Redirect to="/messages/event/expired"/>
    }
    return <EventForm setEvent={setEvent} eventToBeEdited={selectedEvent} />
  } else if (selectedEvent.data && !selectedEvent.data.attributes.approved){
      return <Redirect to="/messages/event/pending"/>
  } else {
    return (
      <div>
        <div className={"tc green-bg f-blue f1-75 mt-5 mb-5"}>{selectedEvent.data && formattedDate.toUpperCase()}</div>
        <Event event={selectedEvent.data} />
      </div>
    )
  }

}
