import React, { useEffect, useState } from 'react'

import { BASE } from '../../index.js'

import EventsList from './EventsList'

export default function EventsContainer(){

  const [daysOfEvents, setDaysOfEvents] = useState([])

  useEffect(() => {
    fetch(BASE + "/events")
      .then(res => res.json())
      .then(setDaysOfEvents)
  }, [])


  return <div>{daysOfEvents.map(day => <EventsList key={"events-"+day.date} date={day.date} events={day.events} />)}</div>
}
