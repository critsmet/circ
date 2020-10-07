import React from 'react'

import { Link } from 'react-router-dom'

export default function Event({event}){
  if (event){
    const { id, attributes: { name, description, categories, time, tags, address } } = event
    return (
      <div id={`$event-${id}-container`} className="border p1 mb1">
        <div id={`$event-${id}-name-date-container`}>
          <Link to={`/events/${id}`}><span className="f1-3">{name.toUpperCase()}</span></Link>
          <span className="fr p-5 f1-3">{time}</span>
        </div>
        <br/>
        <div id={`$event-${id}-address-container`}>
          <span>{address}</span>
        </div>
        <br/>
        <div id={`$event-${id}-description-container`} className="pre-wrap">{description}</div>
        <br/>
        <div id={`$event-${id}-categories-tags-container`}>
          <span>{categories.map(category => <span key={category.name + "-category-key"} className="f1 muted-green-bg p-5 mr1">{category.name.toUpperCase()}</span>)}</span>
          <span className="fr">{tags.map(tag => <span key={tag.name + "-tag-key"} className="p-5">{"#" + tag.name}</span>)}</span>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
