import React from 'react'

import { useHistory } from 'react-router-dom'

const Nav = () => {

  let history = useHistory()

  return (
    <div id="nav">
      <div>
        <span onClick={() => history.push('/')} id="main-logo">CIRCULAR</span>
        <span onClick={() => history.push('/contribute')} id="contribute">+</span>
      </div>
    </div>
  )
}

export default Nav
