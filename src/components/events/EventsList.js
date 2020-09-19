import React from 'react'

import Event from './Event'

export default function EventsList(props){

  console.log(props);

  return (
    <div>
      <div className={"event-list-date"}>{props.date.toUpperCase()}</div>
      {props.events.map(event => <Event key={"event-" + event.data.id} event={event.data} />)}
    </div>
  )
}
