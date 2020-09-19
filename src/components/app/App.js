import React, { useEffect } from 'react';

import { Switch, Route } from 'react-router-dom'

import NavContainer from '../nav/NavContainer'
import EventsContainer from '../events/EventsContainer'
import EventForm from '../events/EventForm'
import EventShow from '../events/EventShow'
import MessageDisplay from '../misc/MessageDisplay'
import LocationInput from './LocationInput'

const App = () => {

  return (
    <div id="app">
      <NavContainer/>
      <Switch>
        <Route exact path="/messages/:subject/:status" component={MessageDisplay} />
        <Route exact path="/contribute" component={EventForm} />
        <Route exact path="/events/:id" component={EventShow} />
        <Route exact path="/events" component={EventsContainer} />
        <Route path="/" component={LocationInput} />
      </Switch>
    </div>
  )
}

export default App;
