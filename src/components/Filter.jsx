import './styles/Filter.css'

import { useContext } from 'react'
import { FilterContext } from '../pages/Search'

export default function Sidebar({ applyHandle }) {
  const { filterState, setFilterState } = useContext(FilterContext)

  const setLocation = (event) => {
    const location = event.target.value
    setFilterState((prevState) => ({
      ...prevState,
      location: location
    }))
  }

  const setMinimum = (event) => {
    var minimum
    if (event.target.value !== 0) {
      minimum = event.target.value
    }
    else {
      minimum = null
    }

    setFilterState((prevState) => ({
      ...prevState,
      min: minimum,
    }))
  }

  const setMaximum = (event) => {
    var maximum
    if (event.target.value !== 0) {
      maximum = event.target.value
    }
    else {
      maximum = null
    }

    setFilterState((prevState) => ({
      ...prevState,
      max: maximum,
    }))
  }

  return (
    <div className="Filter">
      <h1>Find a Walker</h1>
      <hr />
      <div id="options">
        <div style={{flexDirection: "column", gap: "0.5rem"}}>
          <p style={{marginBottom: "0.2rem"}}>Location</p>
          <input placeholder="Enter a Postcode or City" id="location" onChange={setLocation} />
        </div>
        <div>
          <p>Minimum Price</p>
          <p>£ {filterState["min"] ? filterState["min"] : "-"}</p>
        </div>
        <input type="range" min="0" max="100" onChange={setMinimum} defaultValue="0" />
        <div>
          <p>Maximum Price</p>
          <p>£ {filterState["max"] ? filterState["max"] : "-"}</p>
        </div>
        <input type="range" min="0" max="100" onChange={setMaximum} defaultValue="0" />
      </div>
      <button onClick={applyHandle}>Search</button>
    </div>
  )
}