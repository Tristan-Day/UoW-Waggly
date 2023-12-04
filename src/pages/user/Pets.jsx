import './styles/Form.css'
import './styles/Pets.css'

import { Authenticator } from '@aws-amplify/ui-react'
import { withAuthenticator } from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { PetCard } from '../../components'
import { getPets, updatePet } from '../../data/User'

function Pets() {
  const [results, setResults] = useState([])
  const [formData, setFormData] = useState({})

  const navigate = useNavigate()

  const submitHandle = async () => {
    const fields = ["NAME", "BREED", "GENDER", "WEIGHT", "DESCRIPTION"]

    console.log(formData)

    for (const field of fields) {
      if (!(field in formData) || !(field)) {
        alert(`Missing required field '${field}'`)
        return
      }
    }

    try {
      await updatePet(formData["NAME"], formData)

      await alert("Pet Sucessfully Registered")
    }
    catch (error) {
      alert("Registration Failed - Please try again later.")
    }

  }

  async function getPetData() {
    try {
      const data = await getPets();

      if (data.length === 0) {
        setResults(<p id="subtitle">No Pets Registered - You can register a pet using the form below.</p>);
      } else {
        const cards = data.map((pet, index) => (
          <PetCard
            key={index}
            name={pet.NAME}
            gender={pet.GENDER}
            weight={`${pet.WEIGHT} KG`}
            description={pet.DESCRIPTION}
          />
        ));

        setResults(cards);
      }
    } catch (error) {
      setResults(<p id="subtitle">Error While Retreiving Pets - Please try again later.</p>);
    }
  }

  useEffect(() => {
    getPetData();
  }, []);

  return (
    <Authenticator>
      <div style={{ flexGrow: 1, flexDirection: "column" }}>
        <div style={{ padding: "2rem" }}>
          <h1 style={{ margin: "0rem 0rem 1rem 0rem", textAlign: "left" }}>Your Pets</h1>
          <div style={{ display: "flex", gap: "2rem" }}>
            {results}
          </div>
        </div>
        <div id="registration" className="Form" style={{ margin: 0 }}>
          <div id="fields">
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", gap: "2rem" }}>
                <div>
                  <p>Name</p>
                  <input onChange={(event) => { setFormData({ ...formData, NAME: event.target.value }) }} />
                </div>
                <div>
                  <p>Breed</p>
                  <input onChange={(event) => { setFormData({ ...formData, BREED: event.target.value }) }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "2rem" }}>
                <div >
                  <p>Gender</p>
                  <select style={{ width: "240px" }} onChange={(event) => { setFormData({ ...formData, GENDER: event.target.value }) }}>
                    <option value="" hidden>Please Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <p>Weight (KG)</p>
                  <input onChange={(event) => { setFormData({ ...formData, WEIGHT: parseFloat(event.target.value) }) }} />
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>
                <p>Description</p>
                <textarea
                  id="description"
                  onChange={(event) => { setFormData({ ...formData, DESCRIPTION: event.target.value }) }} />
              </div>
            </div>
          </div>
          <div id="controls">
            <button onClick={() => navigate("/settings/animals")}>Cancel</button>
            <button onClick={() => submitHandle()}>Register</button>
          </div>
        </div>
      </div>
    </Authenticator>
  )
}

export default withAuthenticator(Pets)