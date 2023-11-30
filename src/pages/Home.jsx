import './styles/Home.css';

import Navigation from "../components/Navigation"

export default function Home() {
  return (
    <div>
      <Navigation />
      <body>
        <h1 className="Question">Looking for Local Trusted Walkers?</h1>
        <div className="Features">
          <div>
            <img src="./icon/search.svg" />
            <p1>Find trusted walkers who are a great match for you and your pets.</p1>
          </div>
          <div>
            <img src="./icon/phone.svg" />
            <p1>No hidden fees - we make it simple to find and compare prices.</p1>
          </div>
          <div>
            <img src="./icon/glass.svg" />
            <p1>Relax knowing your friend is in capable and safe hands.</p1>
          </div>
        </div>
      </body>
    </div>
  )
}