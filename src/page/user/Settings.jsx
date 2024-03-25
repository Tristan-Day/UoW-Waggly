import './style/Settings.css'

import Icon from '@mdi/react'
import { mdiCardAccountDetails, mdiPaw } from '@mdi/js'

import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

import { Route, Outlet, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

import { AccountContext } from '../../App'
import { Navigation } from '../../component'

import PetManagement from './Pets'
import AccountOverview from './Account'

const UserRoutes = () => {
  return (
    <Route path="settings" element={<Settings />}>
      <Route path="*" element={<AccountOverview />} />
      <Route path="animals" element={<PetManagement />} />
    </Route>
  )
}

function Settings() {
  const [accountData] = useContext(AccountContext)
  const [accountOptionState, setAccountOptionState] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (accountData && accountData['TYPE'] === 'walker') {
      setAccountOptionState(
        <div onClick={() => navigate('/settings/account')}>
          <Icon path={mdiCardAccountDetails} size={0.9} />
          <p>My Details</p>
        </div>
      )
    } else {
      navigate('/settings/animals')
      setAccountOptionState(null)
    }
  }, [accountData])

  return (
    <Authenticator>
      <div
        className="Waggly" 
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Navigation />
        <div style={{ display: 'flex' }}>
          <div className="Settings">
            <h1>Waggly Settings</h1>
            <hr />
            <div id="options">
              {accountOptionState}
              <div onClick={() => navigate('/settings/animals')}>
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
export { UserRoutes }
