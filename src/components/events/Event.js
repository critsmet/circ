import React from 'react'

import queryString from 'query-string'
import { Link, useHistory  } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export default function Event({event}){

  const history = useHistory()
  const dispatch = useDispatch()
  const searchParams = useSelector(state => state.searchParams)
  const queryParams = queryString.parse(searchParams)

  function changeCategory(categoryName){
    let paramsArray = ['/events?']
    if (queryParams.location){
      paramsArray = paramsArray.concat(`location=${queryParams.location.replace(/\s/g, '+')}`)
    }
    if (queryParams.date){
      console.log(queryParams.date, queryParams.date.replace(/\s/g, '+'));
      paramsArray = paramsArray.concat(`date=${queryParams.date.replace(/\s/g, '+')}`)
    }
    paramsArray = paramsArray.concat(`category=${categoryName.replace(/\s/g, '+')}`)
    let firstTwoInParamsString = paramsArray.shift() + paramsArray.shift()
    let paramsString = [firstTwoInParamsString, ...paramsArray].join("&")
    console.log(queryParams, paramsString);
    history.push(paramsString)
  }

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
          <span>{categories.map(category => <span onClick={() => changeCategory(category.name.toLowerCase())} key={category.name + "-category-key"} className="hover-pointer f1 muted-green-bg p-5 mr1">{category.name.toUpperCase()}</span>)}</span>
          <span className="fr">{tags.map(tag => <span key={tag.name + "-tag-key"} className="p-5">{"#" + tag.name}</span>)}</span>
        </div>
      </div>
    )
  } else {
    return <></>
  }
}
