import React from 'react';
import { render } from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom'

import App from './components/app/App';
import './index.css';

export const BASE = "http://localhost:3000"

render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
)
