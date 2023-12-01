import './styles/Card.css';

import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';

export default function WalkerCard({ name, location, description, rate }) {
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
  );
}