import React, { useState, useEffect } from 'react';

import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { fetchCategories } from './appMod'

import Nav from '../nav/Nav'
import EventsContainer from '../events/EventsContainer'
import EventForm from '../events/EventForm'
import EventShow from '../events/EventShow'
import MessageDisplay from '../misc/MessageDisplay'
import Filter from '../nav/Filter'
import Info from '../misc/Info'

const App = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  // Toggle displaying the filter in the navbar
  let [showFilter, setShowFilter] = useState(false)

  return (
    <div id="app">
      <Nav showFilter={showFilter} setShowFilter={setShowFilter}/>
      <div id="main-container">
        <Switch>
          {/* Since React Router 5.1 and React Hooks, the preferred way to render components with Route is as a child, instead of using Component or Render props, and using useLocation, useHistory, useParams hooks to get data*/}
          <Route exact path="/messages/:subject/:status">
            <MessageDisplay/>
          </Route>
          <Route exact path="/add">
            <EventForm/>
          </Route>
          <Route exact path="/events/:id">
            <EventShow/>
          </Route>
          <Route exact path="/events">
            <EventsContainer/>
          </Route>
          <Route exact path="/info">
            <Info/>
          </Route>
          <Route path="/">
            <div id="location-form">
              <Filter/>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  )
}

export default App;
