import './styles/Navigation.css'

import Icon from '@mdi/react'
import { mdiMagnify, mdiHeart, mdiAccountCircle } from '@mdi/js'

import { getCurrentUser } from 'aws-amplify/auth'

import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AccountContext } from '../App'

export default function Navigation() 
{
  const [accountData] = useContext(AccountContext)

  const [signupActionState, setSignupAction] = useState(null)
  const [accountActionState, setAccountAction] = useState(null)

  // Adapt content to walkers and other users
  const getSignupContext = () => {
    if (accountData) 
    {
      if (accountData["TYPE"] === "walker") 
      {
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
  const getAccountAction = () => {
    return getCurrentUser()
      .then(user => setAccountAction(<h1>Your Account</h1>))
      .catch(error => setAccountAction(<h1>Sign In</h1>))
  }

  useEffect(() => {
    getSignupContext()
    getAccountAction()
  }, [])

  const navigate = useNavigate()

  return (
    <div className="Header">
      <nav>
        <img src="./logo.svg" className="Logo" onClick={() => navigate("/")} alt="Waggly Logo" />
        <div className="Item" onClick={() => navigate("/search")}>
          <Icon path={mdiMagnify} size={1.2} color="#F8F8F8" />
          <h1>Search Walkers</h1>
        </div>
        {signupActionState}
        <div className="Account" onClick={() => navigate("/account")}>
          <Icon path={mdiAccountCircle} size={1.2} color="#F8F8F8" />
          {accountActionState}
        </div>
      </nav>
    </div>
  )
}