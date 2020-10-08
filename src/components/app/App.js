import React, { useState, useEffect } from 'react';

import { CSSTransition } from 'react-transition-group'
import { Switch, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { fetchCategories } from './appMod'

import Nav from '../nav/Nav'
import EventsContainer from '../events/EventsContainer'
import EventForm from '../events/EventForm'
import EventShow from '../events/EventShow'
import MessageDisplay from '../misc/MessageDisplay'
import LocationInput from './LocationInput'
import Info from '../misc/Info'

const App = () => {

  const dispatch = useDispatch()

  useEffect(() => dispatch(fetchCategories()), [])

  let [showFilter, setShowFilter] = useState(false)

  return (
    <div id="app">
      <Nav showFilter={showFilter} setShowFilter={setShowFilter}/>
      <div id="main-container">
        <Switch>
          <Route exact path="/messages/:subject/:status" component={MessageDisplay} />
          <Route exact path="/add" component={EventForm} />
          <Route exact path="/events/:id" component={EventShow} />
          <Route exact path="/events" component={EventsContainer} />
          <Route exact path="/info" component={Info}/>
          <Route path="/" component={LocationInput} />
        </Switch>
      </div>
    </div>
  )
}

export default App;
