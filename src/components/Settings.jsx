import './styles/Settings.css'

import Icon from '@mdi/react'
import { mdiCardAccountDetails, mdiPaw } from '@mdi/js'

import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const navigate = useNavigate()

  return (
    <div className="Settings">
      <h1>Account Settings</h1>
      <hr />
      <div className="Options">
        <div onClick={() => navigate("/account")}>
        <Icon path={mdiCardAccountDetails} size={0.9} />
          <p>My Details</p>
        </div>
        <div onClick={() => navigate("/pets")}>
          <Icon path={mdiPaw} size={0.9} />
          <p>My Pets</p>
        </div>
      </div>
    </div>
  )
}