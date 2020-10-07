import React, { useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { fetchEvents } from '../app/appMod'

import EventsList from './EventsList'

export default function EventsContainer({location}){

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchEvents(location.search))
    dispatch({type: "UPDATE_SEARCH_PARAMS", payload: location.search})
  }, [location.search])

  const events = useSelector(state => state.events)

  return <div>{events.map(day => <EventsList key={"events-"+day.date} date={day.date} events={day.events} />)}</div>
}
