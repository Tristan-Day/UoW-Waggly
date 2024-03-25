import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, createContext, useState } from 'react'

import { getAccount } from './logic/User'
import { Home, Search, Signup } from './page'
import { UserRoutes } from './page/user'

Amplify.configure(awsExports)
export const AccountContext = createContext()

function App() {
  const [accountData, setAccountData] = useState(null)

  useEffect(() => {
    async function checkContextAvailability() {
      try {
        setAccountData(await getAccount())
      } catch (error) {
        return
      }
    }
    checkContextAvailability()
  }, [])

  return (
    <AccountContext.Provider value={[accountData, setAccountData]}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="signup" element={<Signup />} />
          {UserRoutes()}
        </Routes>
      </BrowserRouter>
    </AccountContext.Provider>
  )
}

export default App
