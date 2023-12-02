import './styles/Home.css';

import Navigation from "../components/Navigation"

export default function Home() 
{
  return (
    <div>
      <Navigation />
      <body>
        <h1 className="Question">Looking for Local Trusted Walkers?</h1>
        <div className="Features">
          <div>
            <img src="./icon/search.svg" />
            <p>Find trusted walkers who are a great match for you and your pets.</p>
          </div>
          <div>
            <img src="./icon/phone.svg" />
            <p>No hidden fees - we make it simple to find and compare prices.</p>
          </div>
          <div>
            <img src="./icon/glass.svg" />
            <p>Relax knowing your friend is in capable and safe hands.</p>
          </div>
        </div>
      </body>
    </div>
  )
}