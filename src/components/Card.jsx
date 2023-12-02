import './styles/Card.css'

import Icon from '@mdi/react'
import { mdiAccountCircle, mdiPaw } from '@mdi/js'

export function WalkerCard({ name, location, description, rate }) {
  return (
    <div className="Card">
      <Icon path={mdiAccountCircle} size={3.5} color="#F8F8F8" />
      <div>
        <h1>{name}</h1>
        <h2>{location}</h2>
        <p>{description}</p>
      </div>
      <div className="Price">
        <p>From</p>
        <h1>{rate}</h1>
        <p>a Walk</p>
      </div>
    </div>
  )
}

export function PetCard({ name, gender, weight, description }) {
  return (
    <div className="Card" style={{width: "25rem"}}>
      <Icon path={mdiPaw} size={3.5} color="#F8F8F8" />
      <div>
        <div style={{display: "flex", gap: "0.7rem", alignItems: "center"}}>
          <h1>{name}</h1>
          <p>{gender}</p>
        </div>
        <h2>{weight}</h2>
        <p>{description}</p>
      </div>
    </div>
  )
}