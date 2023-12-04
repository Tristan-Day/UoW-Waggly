import './styles/Navigation.css'

import Icon from '@mdi/react'
import { mdiMagnify, mdiHeart, mdiCog } from '@mdi/js'

import { getCurrentUser } from 'aws-amplify/auth'

import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AccountContext } from '../App'

export default function Navigation() {
  const [accountData] = useContext(AccountContext)

  const [signupActionState, setSignupAction] = useState(null)
  const [settingsActionState, setSettingsAction] = useState(null)

  // Adapt content to walkers and other users
  const getSignupContext = () => {
    if (accountData) {
      if (accountData["TYPE"] === "walker") {
        setSignupAction(null)
        return
      }
    }

    setSignupAction(
      <div className="Item" onClick={() => navigate("/signup")}>
        <Icon path={mdiHeart} size={1.2} color="#F8F8F8" />
        <h1>Become a Walker</h1>
      </div>
    )
  }

  // Adapt content to public and authenticated sessions
  const getSettingsAction = () => {
    return getCurrentUser()
      .then(user => setSettingsAction(<h1>Your Account</h1>))
      .catch(error => setSettingsAction(<h1>Sign In</h1>))
  }

  useEffect(() => {
    getSignupContext()
    getSettingsAction()
  }, [accountData])

  const navigate = useNavigate()

  return (
    <nav>
      <img src="/logo.svg" id="logo" onClick={() => navigate("/")} alt="Waggly Logo" />
      <div id="item" onClick={() => navigate("/search")}>
        <Icon path={mdiMagnify} size={1.2} color="#F8F8F8" />
        <h1>Search Walkers</h1>
      </div>
      {signupActionState}
      <div style={{ marginLeft: "auto" }} onClick={() => navigate("/settings")}>
        <Icon path={mdiCog} size={1.2} color="#F8F8F8" />
        {settingsActionState}
      </div>
    </nav>
  )
}