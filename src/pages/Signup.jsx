import './styles/Signup.css'

import { Authenticator } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';

import { post } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navigation from '../components/Navigation';
import { AccountContext } from '../App';

function Signup() 
{
  const [accountContext, setAccountContext] = useContext(AccountContext);
  const [formData, setFromData] = useState({});

  const navigate = useNavigate();

  const submitHandle = async () => {
    const fields = ["first_name", "last_name", "city", "postcode", "description", "rate"];
    const user = await getCurrentUser();

    for (const field of fields) {
      if (!(field in formData) || !(field)) {
        alert(`Missing required field '${field}'`);
        return;
      }
    }

    try {
      const operation = post
        ({
          apiName: "UserService",
          path: "/users/" + user.username,
          options: { body: { ...formData, type: "walker" } }
        })

      await operation.response;

      await alert("Signup Sucessful");
      navigate("/");
    }
    catch (error) {
      alert("Signup Failed - Please try again later.")
    }
  }

  // Prevent a user from attempting to signup more than once
  useEffect(() => {
    if (accountContext && accountContext["TYPE"] === "walker") {
      navigate("/account")
    }
  }, []);

  return (
    <Authenticator>
      <Navigation />
      <div className="Signup">
        <h1>Become a Walker</h1>
        <p>Have a passion for Dogs? - Waggly makes it easy to promote yourself to a network of dog owners.</p>
        <div className='Fields'>
          <div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <p>Firstname</p>
                <input onChange={(event) => { setFromData({ ...formData, first_name: event.target.value }) }} />
              </div>
              <div>
                <p>Lastname</p>
                <input onChange={(event) => { setFromData({ ...formData, last_name: event.target.value }) }} />
              </div>
            </div>
            <div>
              <p>City</p>
              <input onChange={(event) => { setFromData({ ...formData, city: event.target.value }) }} />
            </div>
            <div>
              <p>Postcode</p>
              <input onChange={(event) => { setFromData({ ...formData, postcode: event.target.value }) }} />
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>
              <p>Tell us about yourself</p>
              <textarea
                className="Description"
                placeholder="Owners love to hear about your love for dogs!"
                onChange={(event) => { setFromData({ ...formData, description: event.target.value }) }} />
            </div>
            <div>
              <p>Going Rate</p>
              <div className="Rate">
                <h3>£</h3>
                <input onChange={(event) => { setFromData({ ...formData, rate: parseInt(event.target.value) }) }} />
              </div>
            </div>
          </div>
        </div>
        <div className="Controls">
          <button onClick={() => navigate("/")}>Cancel</button>
          <button onClick={submitHandle}>Submit</button>
        </div>
      </div>
    </Authenticator>
  )
}

export default withAuthenticator(Signup);