import './styles/Form.css'

import { Authenticator } from '@aws-amplify/ui-react'
import { withAuthenticator } from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

import { AccountContext } from '../../App'
import { updateAccount } from '../../data/User'

function Account() {
  const [accountData] = useContext(AccountContext)

  const [formData, setFromData] = useState
    ({
      FIRST_NAME: "",
      LAST_NAME: "",
      CITY: "",
      POSTCODE: "",
      DESCRIPTION: "",
      RATE: "",
    })

  const navigate = useNavigate()

  const updateHandle = async () => {
    const fields = ["FIRST_NAME", "LAST_NAME", "CITY", "POSTCODE", "DESCRIPTION", "RATE"]

    for (const field of fields) {
      if (!(field in formData) || !(field)) {
        alert(`Missing required field '${field}'`)
        return
      }
    }

    try {
      const body = { ...formData, TYPE: "walker" }
      await updateAccount(body)

      await alert("Details Updated Sucessfully")
    }
    catch (error) {
      alert("Update Failed - Please try again later.")
    }
  }

  useEffect((() => {
    if (accountData) {
      setFromData(accountData)
    }
  }), [accountData])

  return (
    <Authenticator>
      <div className="Form">
        <h1 style={{margin: 0}}>Your Details</h1>
        <p>These details are visible on your listing.</p>
        <div id="fields">
          <div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <p>Firstname</p>
                <input defaultValue={formData["FIRST_NAME"]} onChange={(event) => { formData["FIRST_NAME"] = event.target.value }} />
              </div>
              <div>
                <p>Lastname</p>
                <input defaultValue={formData["LAST_NAME"]} onChange={(event) => { formData["LAST_NAME"] = event.target.value }} />
              </div>
            </div>
            <div>
              <p>City</p>
              <input defaultValue={formData["CITY"]} onChange={(event) => { formData["CITY"] = event.target.value }} />
            </div>
            <div>
              <p>Postcode</p>
              <input defaultValue={formData["POSTCODE"]} onChange={(event) => { formData["POSTCODE"] = event.target.value }} />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>
              <p>Biography</p>
              <textarea
                id="description"
                defaultValue={formData["DESCRIPTION"]}
                placeholder="Owners love to hear about your love for dogs!"
                onChange={(event) => { formData["DESCRIPTION"] = event.target.value }} />
            </div>
            <div>
              <p>Going Rate</p>
              <div id="rate">
                <h3>£</h3>
                <input defaultValue={formData["RATE"]} onChange={(event) => { formData["RATE"] = parseInt(event.target.value) }} />
              </div>
            </div>
          </div>
        </div>
        <div id="controls">
          <button onClick={() => navigate("/settings/account")}>Cancel</button>
          <button onClick={updateHandle}>Update</button>
        </div>
      </div>
    </Authenticator>
  )
}

export default withAuthenticator(Account)