import React from 'react'

import Event from './Event'

export default function EventsList({ date, events }){

  return (
    <div>
      <div className={"tc green-bg f-blue f1-75 mt-5 mb-5"}>{date.toUpperCase()}</div>
      {events.map(event => <Event key={"event-" + event.data.id} event={event.data} />)}
    </div>
  )
}
