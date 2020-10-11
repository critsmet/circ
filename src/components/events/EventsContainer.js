import React, { useEffect } from 'react'

import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { fetchEvents } from '../app/appMod'

import EventsList from './EventsList'

export default function EventsContainer(){

  const dispatch = useDispatch()
  const location = useLocation()
  const loading = useSelector(state => state.loading)

  useEffect(() => {
    dispatch({type: "LOADING_TRUE"})
    dispatch({type: "UPDATE_SEARCH_PARAMS", payload: location.search })
    dispatch(fetchEvents(location.search))
  }, [location.search])

  const events = useSelector(state => state.events)

  if (!loading){
    return events.length > 0 ? events.map(day => <EventsList key={"events-"+day.date} date={day.date} events={day.events} />) : <div className={"tc green-bg f-blue f1-75 mt-5 mb-5"}>{"NO EVENTS FOUND – ADJUST THE FILTER AND TRY AGAIN"}</div>
  } else {
    return <div className={"tc green-bg f-blue f1-75 mt-5 mb-5"}>{"LOADING EVENTS..."}</div>
  }
}
