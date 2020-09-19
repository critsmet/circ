import React from 'react'

import { Link } from 'react-router-dom'

export default function Event({event}){
  if (event){
    const { id, attributes: { name, description, categories, time, tags, address } } = event
    return (
      <div className="event-large">
      <div className="event-list-first-row">
      <Link to={`/events/${id}`}><span className="event-large-name">{name.toUpperCase()}</span></Link>
      <span className="event-large-time">{time}</span>
      </div>
      <br/>
      <div className="event-list-second-row">
      <span className="event-large-address">{address}</span>
      </div>
      <br/>
      <div className="event-description">{description}</div>
      <br/>
      <span className="event-large-categories">{categories.map(category => <span key={category.name + "-category-key"} className="event-large-category">{category.name.toUpperCase()}</span>)}</span>
      <span className="event-large-tags">{tags.map(tag => <span key={tag.name + "-tag-key"} className="event-large-tag">{"#" + tag.name}</span>)}</span>
      <br/>
      <br/>
      </div>
    )
  } else {
    return <></>
  }
}
