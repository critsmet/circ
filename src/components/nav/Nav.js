import React from 'react'

import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Route } from 'react-router-dom'

import Filter from './Filter'

const Nav = ({showFilter, setShowFilter}) => {

  let history = useHistory()
  let searchParams = useSelector(state => state.searchParams)

  function navAway(url){
    setShowFilter(false)
    history.push(url)
  }

  return (
    <div id="nav-container">
      <div id="nav" className="f3">
        <span onClick={() => navAway(searchParams === '' ? '/' : "/events" + searchParams)} id="main-logo" className="hover-pointer">CIRCULAR</span>
        <span onClick={() => navAway('/info')} className="fr ml2 hover-pointer">INFO</span>
        <span onClick={() => navAway('/add')} className="fr ml2 hover-pointer">ADD</span>
        <Route path="/events">
          <span onClick={() => setShowFilter(!showFilter)} id="contribute" className="fr hover-pointer">FILTER</span>
        </Route>
      </div>
      <div id="nav-filter">
        {showFilter && <Filter submitFunctions={[() => setShowFilter(false)]}/>}
      </div>
    </div>
  )
}

export default Nav
