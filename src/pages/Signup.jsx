import './user/styles/Form.css'

import { Authenticator } from '@aws-amplify/ui-react'
import { withAuthenticator } from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AccountContext } from '../App'
import { Navigation } from '../components/'

import { getAccount, updateAccount } from '../data/User'

function Signup() {
  const [accountData, setAccountData] = useContext(AccountContext)
  const [formData, setFromData] = useState({})

  const navigate = useNavigate()

  const submitHandle = async () => {
    const fields = ["FIRST_NAME", "LAST_NAME", "CITY", "POSTCODE", "DESCRIPTION", "RATE"]

    for (const field of fields) {
      if (!(field in formData) || !(field)) {
        alert(`Missing required field '${field}'`)
        return
      }
    }

    // Data validation checks
    if (formData["FIRSTNAME"].length > 30)
    {
      alert("Firstname cannot exceed 30 characters")
    }

    if (formData["LASTNAME"].length > 30)
    {
      alert("Lastname cannot exceed 30 characters")
    }

    if (formData["RATE"] > 100) {
      alert("Rate cannot be set higher than £100")
    }

    try {
      const body = { ...formData, TYPE: "walker" }
      await updateAccount(body)

      await alert("Signup Sucessful")
    }
    catch (error) {
      alert("Signup Failed - Please try again later.")
    }

    try {
      setAccountData(await getAccount())
      navigate("/")
    }
    catch (error) {
      return
    }
  }

  // Prevent a user from attempting to signup more than once
  useEffect(() => {
    if (accountData && accountData["TYPE"] === "walker") {
      navigate("/settings/account")
    }
  }, [accountData])

  return (
    <Authenticator>
      <Navigation />
      <div className="Form">
        <h1 id="heading">Become a Walker</h1>
        <p id="subheading">Have a passion for Dogs? - Waggly makes it easy to promote yourself to a network of dog owners.</p>
        <div id="fields">
          <div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <p>Firstname</p>
                <input onChange={(event) => { setFromData({ ...formData, FIRST_NAME: event.target.value }) }} />
              </div>
              <div>
                <p>Lastname</p>
                <input onChange={(event) => { setFromData({ ...formData, LAST_NAME: event.target.value }) }} />
              </div>
            </div>
            <div>
              <p>City</p>
              <input onChange={(event) => { setFromData({ ...formData, CITY: event.target.value }) }} />
            </div>
            <div>
              <p>Postcode</p>
              <input onChange={(event) => { setFromData({ ...formData, POSTCODE: event.target.value }) }} />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>
              <p>Tell us about yourself</p>
              <textarea
                id="description"
                placeholder="Owners love to hear about your love for dogs!"
                onChange={(event) => { setFromData({ ...formData, DESCRIPTION: event.target.value }) }} />
            </div>
            <div>
              <p>Going Rate</p>
              <div id="rate">
                <h3>£</h3>
                <input onChange={(event) => { setFromData({ ...formData, RATE: parseInt(event.target.value) }) }} />
              </div>
            </div>
          </div>
        </div>
        <div id="controls">
          <button onClick={() => navigate("/")}>Cancel</button>
          <button onClick={() => submitHandle()}>Submit</button>
        </div>
      </div>
    </Authenticator>
  )
}

export default withAuthenticator(Signup)