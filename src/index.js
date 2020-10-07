import React from 'react'
import { render } from 'react-dom'

import { BrowserRouter as Router } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import './index.css';
import App from './components/app/App';
import { appReducer } from './components/app/appMod'

const store = createStore(appReducer, applyMiddleware(thunk))

export const BASE = "http://localhost:3000"

render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
)
