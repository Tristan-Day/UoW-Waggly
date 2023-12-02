import './styles/Home.css'

import { Navigation } from "../components/"

export default function Home() 
{
  return (
    <div>
      <Navigation />
      <body>
        <h1 className="Question">Looking for Local Trusted Walkers?</h1>
        <div className="Features">
          <div>
            <img src="./icon/search.svg" alt="A Magnifying Glass"/>
            <p>Find trusted walkers who are a great match for you and your pets.</p>
          </div>
          <div>
            <img src="./icon/phone.svg" alt="A Phone with a Pound Symbol" />
            <p>No hidden fees - we make it simple to find and compare prices.</p>
          </div>
          <div>
            <img src="./icon/glass.svg" alt="A Glass with Ice Cubes and a Straw"/>
            <p>Relax knowing your friend is in capable and safe hands.</p>
          </div>
        </div>
      </body>
    </div>
  )
}