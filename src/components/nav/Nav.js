import React from 'react'

import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { Route } from 'react-router-dom'

import Filter from './Filter'

const Nav = ({showFilter, setShowFilter}) => {

  let history = useHistory()
  let searchParams = useSelector(state => state.searchParams)

  return (
    <div id="nav" className="pt-1 w-100">
      <span onClick={() => searchParams !== '' ? history.push(`/events${searchParams}`) : history.push('/')} id="main-logo" className="hover-pointer">CIRCULAR</span>
      <span className="ml2" onClick={() => history.push('/info')} className="fr ml2 hover-pointer">INFO</span>
      <span className="ml2" onClick={() => history.push('/add')} className="fr ml2 hover-pointer">ADD</span>
      <Route path="/events">
        <span onClick={() => setShowFilter(!showFilter)} id="contribute" className="fr hover-pointer">FILTER</span>
        {showFilter && <Filter showFilter={showFilter} setShowFilter={setShowFilter}/>}
      </Route>
    </div>
  )
}

export default Nav
