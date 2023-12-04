import './styles/Search.css'

import { get } from 'aws-amplify/api'
import { Authenticator } from '@aws-amplify/ui-react'
import { withAuthenticator } from '@aws-amplify/ui-react'

import '@aws-amplify/ui-react/styles.css'

import { useState, createContext } from 'react'
import { Navigation, Sidebar, WalkerCard} from '../components/'

export const FilterContext = createContext()

function Search() 
{
  const [filterState, setFilterState] = useState({ location: null, min: null, max: null })
  const [results, setResults] = useState([])

  const applyHandle = async () => {
    var query = "/users/search/"

    if (filterState["location"]) {
      query += filterState["location"]
    }
    else {
      alert("Please enter a City or Postcode")
      return
    }

    if (filterState["min"] > filterState["max"] && filterState["max"]) {
      alert("Minimum rate cannot exceed Maximum")
      return
    }

    if (filterState["min"]) {
      query += "?minimum=" + filterState["min"]
    }

    if (filterState["max"]) {
      if (filterState["min"]) {
        query += "&maximum=" + filterState["max"]
      }
      else {
        query += "?maximum=" + filterState["max"]
      }
    }

    try {
      const operation = get
        ({
          apiName: "UserService",
          path: query
        })

      const { body } = await operation.response

      setResults([])
      setResults(await body.json())
    }
    catch (error) {
      alert("Error while retreiving walkers")
    }
  }

  return (
    <Authenticator>
      <Navigation />
      <div style={{display: "flex"}}>
        <FilterContext.Provider value={{ filterState, setFilterState }}>
          <Sidebar applyHandle={applyHandle} />
          <div id="results">
            {results.map((walker, index) => (
              <WalkerCard
                key={index}
                name={`${walker.FIRST_NAME} ${walker.LAST_NAME}`}
                location={walker.CITY}
                description={walker.DESCRIPTION}
                rate={`£${walker.RATE}`}
              />
            ))}
          </div>
        </FilterContext.Provider>
      </div>
    </Authenticator>
  )
}

export default withAuthenticator(Search)