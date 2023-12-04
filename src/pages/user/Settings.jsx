import './styles/Settings.css'

import Icon from '@mdi/react'
import { mdiCardAccountDetails, mdiPaw } from '@mdi/js'

import { Authenticator } from '@aws-amplify/ui-react'
import { withAuthenticator } from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import { Outlet, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

import { AccountContext } from '../../App'
import { Navigation } from '../../components'


function Settings() {
  const [accountData] = useContext(AccountContext)
  const [accountOptionState, setAccountOptionState] = useState(null)

  const navigate = useNavigate()

  useEffect((() => {
    if (accountData && accountData["TYPE"] === 'walker') {
      setAccountOptionState(
        <div onClick={() => navigate("/settings/account")}>
          <Icon path={mdiCardAccountDetails} size={0.9} />
          <p>My Details</p>
        </div>
      )
    }
    else {
      // Auto-redirect Owners
      navigate("/settings/animals")
      setAccountOptionState(null)
    }
  }), [accountData])

  return (
    <Authenticator>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Navigation />
        <div style={{ display: "flex" }}>
          <div className="Sidebar">
            <h1>Account Settings</h1>
            <hr />
            <div className="Options">
              {accountOptionState}
              <div onClick={() => navigate("/settings/animals")}>
                <Icon path={mdiPaw} size={0.9} />
                <p>My Pets</p>
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </Authenticator>
  )
}

export default withAuthenticator(Settings)