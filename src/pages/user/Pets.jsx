import './styles/Pets.css'

import { Authenticator } from '@aws-amplify/ui-react'
import { withAuthenticator } from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { PetCard } from '../../components'
import { getPets } from '../../data/User'

function Pets() 
{
  const [results, setResults] = useState([])

  useEffect(() => {
    async function getPetData() {
      setResults(await getPets())
    }
    getPetData();
  }, []);

  const navigate = useNavigate()

  return (
    <Authenticator>
      <div className="Pets">
          <div className="Header">
            <h1>Your Dogs</h1>
            <button onClick={() => {navigate("/account/animals/register")}}>Register</button>
          </div>
          <div className="List">
            {results.map((pet, index) => 
            (
              <PetCard
                key={index}
                name={pet.NAME}
                gender={pet.GENDER}
                weight={`${pet.WEIGHT} KG`}
                description={pet.DESCRIPTION}
              />
            ))
            }
          </div>
        </div>
    </Authenticator>
  )
}

function PetRegistration()
{
  return (
    <div></div>
  )
}

export default withAuthenticator(Pets)