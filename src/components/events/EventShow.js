import React, { useEffect, useState } from 'react'

import { Redirect, useLocation, useParams } from 'react-router-dom'

import { BASE } from '../../index.js'

import Event from './Event'
import EventForm from './EventForm'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function EventShow(){


  const location = useLocation()
  const { id } = useParams()

  //This component is responsible for rendering both the 'show' view for an event (EventShow component) as well as the 'edit' view for an event (EventForm component)
  //An editToken parameter in the URL that matches with the edit_token attribute on the event will render the edit form
  const urlParams = new URLSearchParams(location.search)
  const editToken = urlParams.get("edit_token")
  const [retrievedEvent, setEvent] = useState({})

  useEffect(() => {
    fetch(BASE + `/events/${id}`)
      .then(res => res.json())
      .then(setEvent)
  }, [])

  let formattedDate = ""

  if (retrievedEvent.data){
    formattedDate = new Date(retrievedEvent.data.attributes.date).toString().split(" ").slice(0, 4)
    formattedDate.splice(1, 2, `${formattedDate[1]} ${formattedDate[2]}`)
    formattedDate.splice(0, 1, days[new Date(retrievedEvent.data.attributes.date).getDay()])
    formattedDate = formattedDate.join(", ")
  }

  if (retrievedEvent.data && retrievedEvent.data.attributes.edit_token === editToken){
    if (new Date(retrievedEvent.data.attributes.date) <= new Date()){
      return <Redirect to="/messages/event/expired"/>
    }
    return <EventForm setEvent={setEvent} eventToBeEdited={retrievedEvent} />
  } else if (retrievedEvent.data && !retrievedEvent.data.attributes.approved){
      return <Redirect to="/messages/event/pending"/>
  } else {
    return (
      <div>
        <div className={"tc green-bg f-blue f1-75 mt-5 mb-5"}>{retrievedEvent.data && formattedDate.toUpperCase()}</div>
        <Event event={retrievedEvent.data} />
      </div>
    )
  }

}
